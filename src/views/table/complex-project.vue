<template>
  <div v-if="!data">
    loading
  </div>
  <div v-else>
    {{ data }}
  </div>
</template>

<script>
import { fetchDetail } from "@/api/article";
export default {
  data() {
    return {
      data: null,
    };
  },
  created() {
    const id = this.$route.query.id;

    if (!id) return;
    fetchDetail(id).then((res) => {
      console.log(res);
      this.data = res.data;
    });
  },
};
</script>

<style></style>
