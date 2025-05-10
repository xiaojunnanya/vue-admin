<template>
  <div>
    <div v-if="!data">
      loading...
    </div>
    <div v-else>
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
    </div>
  </div>
</template>

<script>
import { fetchDetail } from "@/api/article";
export default {
  data() {
    return {
      data: null,
      tableData: [],
    };
  },
  created() {
    const id = this.$route.query.id;
    if (!id) {
      this.$message.error("请先通过考核方案点击查看详情");
      return;
    }
    this.fetchDetails(id); // 可根据实际传参修改
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

    async fetchDetails(id) {
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

      this.tableData = [...key, ...basic];
    },

    download(url) {
      window.open(url, "_blank");
    },
  },
};
</script>
<style scoped lang="css">
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
