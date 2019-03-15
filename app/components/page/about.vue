<template>
  <Page>
    <ActionBar title="About">
      <NavigationButton android.systemIcon="ic_menu_back" @tap="goBack"/>
    </ActionBar>
    <StackLayout>
      <Label text="https://github.com/Zillionnn" top="30" left="30"/>
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
</style>
