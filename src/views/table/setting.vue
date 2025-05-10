<template>
  <div class="setting-container">
    <el-form
      :model="formData"
      label-width="180px"
    >
      <el-form-item label="基础分">
        <el-input-number
          v-model="formData.basicScore"
          :min="0"
          :max="100"
        />
      </el-form-item>
      <el-form-item label="重点指标通过加分">
        <el-input-number
          v-model="formData.keyIndicatorPass"
          :min="0"
          :max="100"
        />
      </el-form-item>
      <el-form-item label="重点指标未通过扣分">
        <el-input-number
          v-model="formData.keyIndicatorNoPass"
          :min="0"
          :max="100"
        />
      </el-form-item>
      <el-form-item label="基本指标通过加分">
        <el-input-number
          v-model="formData.commonIndicatorPass"
          :min="0"
          :max="100"
        />
      </el-form-item>
      <el-form-item label="基本指标未通过扣分">
        <el-input-number
          v-model="formData.commonIndicatorNoPass"
          :min="0"
          :max="100"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleSave"
        >
          保存设置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchList, saveSetting } from "@/api/setting";

export default {
  data() {
    return {
      formData: {
        basicScore: 0,
        keyIndicatorPass: 0,
        keyIndicatorNoPass: 0,
        commonIndicatorPass: 0,
        commonIndicatorNoPass: 0,
      },
    };
  },
  created() {
    fetchList().then((res) => {
      this.formData = {
        ...res.data,
        keyIndicatorNoPass: -res.data.keyIndicatorNoPass,
        commonIndicatorNoPass: -res.data.commonIndicatorNoPass,
      };
    });
  },
  methods: {
    async handleSave() {
      const res = await saveSetting({
        ...this.formData,
        keyIndicatorNoPass: -this.formData.keyIndicatorNoPass,
        commonIndicatorNoPass: -this.formData.commonIndicatorNoPass,
      });

      if (res.message === "ok") {
        this.$message.success("保存成功");
      }
    },
  },
};
</script>

<style scoped>
.setting-container {
  padding: 20px;
}
</style>
