<template>
  <Page>
    <ActionBar title="About">
      <NavigationButton android.systemIcon="ic_menu_back" @tap="goBack"/>
    </ActionBar>
    <StackLayout>
      <Label text="SaveInsPic" class="center_msg h1"/>
      <Label text="https://github.com/Zillionnn" class="center_msg"/>
    </StackLayout>
  </Page>
</template>

<script>
import App from "../App";
export default {
  name: "About",
  components: {
    App
  },
  data() {
    return {};
  },
  methods: {
    goBack() {
      this.$navigateTo(App);
    }
  }
};
</script>

<style scoped>
Page {
  background: #333333;
  color: #ffffff;
}
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}
.center_msg{
  margin:0 auto;
  text-align: center;
}
.h1{
  font-size: 43px;
}
</style>
