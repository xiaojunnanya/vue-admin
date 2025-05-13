<template>
  <div>
    <div v-if="!data">
      loading...
    </div>
    <div v-else>
      <div class="button-group">
        <el-button
          type="primary"
          @click="showAddProjectDialog"
        >
          新增考核项目
        </el-button>
        <el-button
          type="primary"
          @click="showAddIndicatorDialog"
        >
          新增考核指标
        </el-button>
      </div>
      <div class="titleName">
        {{ data.name }}
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :span-method="mergeCells"
      >
        <el-table-column
          prop="category"
          label="分类"
          width="80"
        />
        <el-table-column
          prop="index"
          label="序号"
          width="60"
        />
        <el-table-column
          prop="project"
          label="考核项目"
          width="200"
        />
        <el-table-column
          prop="indicator"
          label="考核指标"
        />
        <el-table-column
          prop="assessmentBasis"
          label="考核依据"
        />
        <el-table-column
          prop="examineTime"
          label="考核时间"
          width="150"
        />
        <el-table-column
          prop="examineDepartment"
          label="考核单位"
          width="200"
        />
        <el-table-column
          prop="monitorDepartment"
          label="监测单位"
          width="120"
        />
        <el-table-column
          label="文件"
          width="100"
        >
          <template #default="scope">
            <div v-if="scope.row.files && scope.row.files.length">
              <el-button
                v-for="(file, index) in scope.row.files"
                :key="index"
                type="text"
                @click="download(file.url)"
              >
                {{ file.name }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        title="新增考核项目"
        :visible.sync="addProjectDialogVisible"
        width="30%"
      >
        <el-form :model="newProjectForm">
          <el-form-item label="分类">
            <el-select
              v-model="newProjectForm.category"
              placeholder="请选择分类"
            >
              <el-option
                label="基本指标"
                value="0"
              />
              <el-option
                label="重点指标"
                value="1"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="考核指标">
            <el-input
              v-model="newProjectForm.indicator"
              style="width: 300px"
              placeholder="请输入考核指标"
            />
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="addProjectDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="submitProjectForm"
          >确定</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="新增考核指标"
        :visible.sync="addIndicatorDialogVisible"
        width="50%"
      >
        <el-form :model="newIndicatorForm">
          <el-form-item label="考核项目">
            <el-select
              v-model="newIndicatorForm.project"
              placeholder="请选择考核项目"
            >
              <el-option
                v-for="item in tableData.filter(
                  (v, i, arr) =>
                    arr.findIndex((t) => t.project === v.project) === i
                )"
                :key="item.id"
                :label="item.project"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="考核指标">
            <el-input
              v-model="newIndicatorForm.indicator"
              style="width: 300px"
              placeholder="请输入考核指标"
            />
          </el-form-item>
          <el-form-item label="考核依据">
            <el-input
              v-model="newIndicatorForm.assessmentBasis"
              style="width: 300px"
              placeholder="请输入考核依据"
            />
          </el-form-item>
          <el-form-item label="考核时间">
            <el-date-picker
              v-model="newIndicatorForm.examineTime"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="考核单位">
            <el-select
              v-model="newIndicatorForm.examineDepartment"
              placeholder="请选择考核单位"
            >
              <el-option
                v-for="(item, index) in departmentOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="监测单位">
            <el-select
              v-model="newIndicatorForm.monitorDepartment"
              placeholder="请选择监测单位"
            >
              <el-option
                v-for="(item, index) in departmentOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="addIndicatorDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="submitIndicatorForm"
          >确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { fetchDetail, addAssess, addAssessIndex } from "@/api/article";
import { fetchList as fetchListUnit } from "@/api/unit";
import moment from "moment";
export default {
  data() {
    return {
      data: null,
      tableData: [],
      addProjectDialogVisible: false,
      addIndicatorDialogVisible: false,
      newProjectForm: {
        category: "",
        indicator: "",
      },
      newIndicatorForm: {
        project: "",
        indicator: "",
        assessmentBasis: "",
        examineTime: "",
        examineDepartment: "",
        monitorDepartment: "",
      },
    };
  },
  created() {
    const id = this.$route.query.id;
    if (!id) {
      this.$message.error("请先通过考核方案点击查看详情");
      return;
    }
    this.fetchDetails(); // 可根据实际传参修改
  },
  methods: {
    mergeCells({ row, column }) {
      const prop = column.property;
      if (prop === "category") {
        if (row._showCategory) {
          return { rowspan: row._categoryRowspan, colspan: 1 };
        } else {
          return { rowspan: 0, colspan: 0 };
        }
      }

      if (prop === "project" || prop === "index") {
        if (row._showProject) {
          return { rowspan: row._projectRowspan, colspan: 1 };
        } else {
          return { rowspan: 0, colspan: 0 };
        }
      }
    },

    async fetchDetails() {
      const id = this.$route.query.id;
      const { data } = await fetchDetail(id); // 你自己的请求函数
      this.data = data;

      const transform = (list, category) => {
        const rows = [];
        console.log(list, "list");
        list.forEach((project, projectIndex) => {
          const indicators = project.contentList || [];
          const index = projectIndex + 1; // 项目编号

          if (indicators.length === 0) {
            rows.push({
              category,
              index,
              id: project.id,
              project: project.name,
              indicator: "",
              assessmentBasis: "",
              examineTime: "",
              examineDepartment: "",
              monitorDepartment: "",
              files: [],
            });
            return;
          }

          indicators.forEach((item) => {
            rows.push({
              category,
              index,
              id: project.id,
              project: project.name,
              indicator: item.name,
              assessmentBasis: item.assessmentBasis,
              examineTime: item.examineTime,
              examineDepartment: item.examineDepartment.name,
              monitorDepartment: item.monitorDepartment.name,
              files: item.files?.map((item) => {
                return {
                  name: item,
                  url: `/api/file.download/${item}`,
                };
              }),
            });
          });
        });

        // 分类合并
        const categoryStartIndex = rows.length > 0 ? 0 : -1;
        if (categoryStartIndex >= 0) {
          rows[0]._showCategory = true;
          rows[0]._categoryRowspan = rows.length;
          for (let i = 1; i < rows.length; i++) {
            rows[i]._showCategory = false;
          }
        }

        // 考核项目合并（包含项目名、序号）
        const projectMap = {};
        rows.forEach((row, i) => {
          const key = row.project;
          if (!projectMap[key]) projectMap[key] = [];
          projectMap[key].push(i);
        });

        Object.values(projectMap).forEach((indexes) => {
          indexes.forEach((i, j) => {
            if (j === 0) {
              rows[i]._showProject = true;
              rows[i]._projectRowspan = indexes.length;

              rows[i]._showIndex = true;
              rows[i]._indexRowspan = indexes.length;
            } else {
              rows[i]._showProject = false;
              rows[i]._showIndex = false;
            }
          });
        });

        return rows;
      };

      const basic = transform(data.content.basicIndicators, "基本指标");
      const key = transform(data.content.keyIndicators, "重点指标");

      console.log([...key, ...basic], "data");
      this.tableData = [...key, ...basic];

      fetchListUnit().then((res) => {
        console.log(res.data, "res");
        this.departmentOptions = res.data;
      });
    },

    download(url) {
      window.open(url, "_blank");
    },
    showAddProjectDialog() {
      this.addProjectDialogVisible = true;
    },
    showAddIndicatorDialog() {
      this.addIndicatorDialogVisible = true;
    },
    async submitProjectForm() {
      this.addProjectDialogVisible = false;
      await addAssess({
        indicators: Number(this.newProjectForm.category),
        name: this.newProjectForm.indicator,
        planId: Number(this.$route.query.id),
        sort: this.tableData.length + 1,
      });
      this.newProjectForm = {
        category: "",
        indicator: "",
      };
      this.$message.success("新增考核项目成功");
      this.fetchDetails();
    },
    async submitIndicatorForm() {
      this.addIndicatorDialogVisible = false;
      await addAssessIndex({
        assessmentBasis: this.newIndicatorForm.assessmentBasis,
        examineDepartmentId: Number(this.newIndicatorForm.examineDepartment),
        examineTime: this.newIndicatorForm.examineTime
          ? moment(this.newIndicatorForm.examineTime).format("YYYY年M月D日")
          : "",
        monitorDepartmentId: Number(this.newIndicatorForm.monitorDepartment),
        name: this.newIndicatorForm.indicator,
        projectId: Number(this.newIndicatorForm.project),
        planId: Number(this.$route.query.id),
      });
      this.fetchDetails();
      this.$message.success("新增考核指标成功");
      this.newIndicatorForm = {
        project: "",
        indicator: "",
        assessmentBasis: "",
        examineTime: "",
        examineDepartment: "",
        monitorDepartment: "",
      };
    },
  },
};
</script>
<style scoped lang="css">
.button-group {
  margin: 20px;
  text-align: right;
}
.el-button {
  margin: 0 3px;
}
.titleName {
  text-align: center;
  margin: 18px;
}

/deep/ .el-table__body tr:hover > td {
  background-color: inherit !important;
}
</style>
