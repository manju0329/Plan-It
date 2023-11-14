<script setup>
defineProps({ member: Object });
</script>

<template>
  <tr class="text-center">
    <th scope="row">{{ member.userId }}</th>
    <td class="text-start">
      <router-link
        :to="{ name: 'member-view', params: { userId: member.userId } }"
        class="article-title link-dark"
      >
        {{ member.userName }}
      </router-link>
    </td>
    <td>{{ member.userName }}</td>
    <td>{{ member.joinDate }}</td>
    <td>{{ member.userRole }}</td>
  </tr>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>
