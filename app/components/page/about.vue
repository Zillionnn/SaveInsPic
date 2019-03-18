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

ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}
.center_msg{
  margin:0 auto;
  text-align: center;
  color: #000000;
}
.h1{
  margin-top: 30px;
  font-size: 32px;
}
</style>
