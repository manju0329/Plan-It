<script setup>
defineProps({ article: Object });
</script>

<template>
  <tr class="text-center" :class="{ noti: article.notification }">
    <th scope="row">
      <div v-if="article.notification">공지</div>
      <div v-else>{{ article.articleNo }}</div>
    </th>
    <td class="text-start">
      <router-link
        :to="{ name: 'article-view', params: { articleno: article.articleNo } }"
        class="article-title link-dark"
      >
        {{ article.subject }}
      </router-link>
    </td>
    <td>{{ article.userName }}</td>
    <td>{{ article.hit }}</td>
    <td>{{ article.registerTime }}</td>
  </tr>
</template>

<style scoped>
a {
  text-decoration: none;
}

.table .noti {
  --bs-table-bg: #f2f2f2;
}
</style>
