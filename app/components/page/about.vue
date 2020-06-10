<template>
  <Page>
    <ActionBar title="About">
      <NavigationButton android.systemIcon="ic_menu_back" @tap="goBack"/>
    </ActionBar>
    <StackLayout class="page_body">
      <Label text="How To Use" class="left_title h1"/>
      <Label text="1. open the app, and press the home buton, DONT PRESS the BACK button, it would close the app (Will fix it later)"
       :textWrap="true" class="text_line"/>
      <Label text="2. Press the home button to open instagram, click on the top right corner of the image you want to download, copy the link" :textWrap="true" class="text_line"/>
      <Label text="3. Then open this app, you will see the images" class="text_line"/>

      <Label text="如何使用" class="left_title h1"/>
      <Label text="1. 打开app, 不要按返回键，否则会退出app (后期会改进)" :textWrap="true" class="text_line"/>
      <Label text="2. 按home键，打开instagram，对需要下载的图片点击右上角，复制链接" :textWrap="true" class="text_line"/>
      <Label text="3. 打开本app，将会看到你需要的图片" :textWrap="true" class="text_line"/>

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
.left_title{
  margin:14px 7px;
  color: #000000;
}
.center_msg{
  margin:14px auto;
  text-align: center;
  color: #000000;
}
.page_body{
  padding:5px;
}
.h1 {
  margin-top: 30px;
  font-size: 32px;
}
.text_line{
  margin: 6px;
}
.github{
  margin-top:50px;
}
</style>
