<template>
	<StackLayout class="fab-item" :backgroundColor="color"  @tap="$emit('onButtonTap')" @touch="onButtonTouch">
		<Label :text="title" horizontalAlignment="center" />
	</StackLayout>
</template>

<script>
	export default {
	props: { title: String, color: String },
	methods:{
		onButtonTouch(){
			this.$emit('onButtonTouch')
		}
	}
}

</script>

<style scoped>
	.fab-item {
		width: 45;
		height: 45;
		border-radius: 22.5;
		color: #fff;
		font-weight: bold;
		vertical-align: center;
	}
</style>