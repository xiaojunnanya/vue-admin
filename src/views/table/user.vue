<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        label="用户名"
        min-width="150px"
      >
        <template slot-scope="{ row }">
          <span class="link-type">{{ row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="单位名称"
        width="200px"
      >
        <template slot-scope="{ row }">
          <span v-if="row.department">{{ row.department.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="邮箱"
        width="200px"
      >
        <template slot-scope="{ row }">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="角色"
        width="200px"
      >
        <template slot-scope="{ row }">
          <span v-if="row.userRole === 'admin'">管理员</span>
          <span v-else>{{ row.userRole === 'user' ? '普通用户' : '禁用' }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="状态" width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column label="创建时间" width="200px">
        <template slot-scope="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column> -->

      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="250"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            type="primary"
            size="mini"
            :disabled="row.userRole === 'admin'"
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            :disabled="row.userRole === 'admin'"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="dialogStatus === 'create' ? '新建方案' : '编辑方案'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item
          label="单位名称"
          prop="department"
        >
          <el-select
            v-model="temp.department.id"
            placeholder="请选择单位"
            clearable
          >
            <el-option
              v-for="item in departmentOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item
          label="角色"
          prop="userRole"
        >
          <el-select
            v-model="temp.userRole"
            placeholder="请选择角色"
          >
            <el-option
              label="普通用户"
              value="user"
            />
            <el-option
              label="禁用"
              value="ban"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-form-item
        v-show="dialogStatus === 'update'"
        label="状态"
        prop="status"
      >
        <el-select
          v-model="temp.status"
          class="filter-item"
          placeholder="请选择"
        >
          <el-option
            v-for="item in calendarTypeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="
            dialogStatus === 'create' ? createData() : updateData(temp.id)
          "
        >
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogPvVisible"
      title="Reading statistics"
    >
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          prop="key"
          label="Channel"
        />
        <el-table-column
          prop="pv"
          label="Pv"
        />
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogPvVisible = false"
        >{{
          $t("table.confirm")
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPv, createArticle } from "@/api/article";
import { fetchList as fetchListUnit } from "@/api/unit";
import { fetchList, deleteArticle, updateArticle } from "@/api/user";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 0, display_name: "暂停" },
  { key: 1, display_name: "启用" },
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      departmentOptions: [], // 新增部门选项数组
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        name: "",
        type: undefined,
        sort: "+id",
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        username: '',
        email: '',
        userRole: 'user',
        department: {
          name: ''
        },
        importance: 1,
        remark: "",
        timestamp: new Date(),
        name: "",
        type: "",
        status: 0,
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change",
          },
        ],
        name: [{ required: true, message: "请填写方案名称", trigger: "blur" }],
      },
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
    this.getDepartments(); // 新增获取部门数据方法
  },
  methods: {

    typeFilter(type) {
      console.log(type, 'type');
      return calendarTypeKeyValue[type];
    },
    getList() {
      this.listLoading = true;

      fetchList({
        name: this.listQuery.name,
        current: this.listQuery.page,
        pageSize: this.listQuery.limit,
        sortOrder: "desc",
        sortField: "createTime",
      }).then((response) => {
        this.list = response.data;

        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success",
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        // importance: 1,
        // remark: "",
        // timestamp: new Date(),
        name: "",
        status: 0,
        // type: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          createArticle({
            name: this.temp.name,
          }).then(() => {
            this.getList();
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData(id) {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          updateArticle({
            id,
            departmentId: this.temp.department.id,
            email: this.temp.email,
            userRole: this.temp.userRole,
            username: this.temp.username,
          }).then(() => {
            this.getList();
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleDelete(row, index) {
      deleteArticle({
        id: row.id,
      }).then(() => {
        this.getList();
        this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success",
          duration: 2000,
        });
        this.list.splice(index, 1);
      });
    },
    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = ["timestamp", "name", "type", "importance", "status"];
        const filterVal = ["timestamp", "name", "type", "importance", "status"];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
    handleNameClick(id) {
      this.$router.push({
        path: "/complex-project",
        query: { id },
      });
    },
    getDepartments() {
      fetchListUnit().then((res) => {
        console.log(res, 'resres')
      this.departmentOptions = res.data
    });
    },
  },
};
</script>
