<template>
    <div class="header">
        <b-row class="text-center">
            <b-col cols="3">Symbol</b-col>
            <b-col cols="3">Currency</b-col>
            <b-col cols="3">Category name</b-col>
            <b-col cols="3"></b-col>
        </b-row>
    </div>
</template>

<script>
    export default {
        name: "tableHeader",
        props: {
            
        }
    }
</script>

<style scoped>
    .header {
        margin-bottom: 5px;
        margin-top: 5px;
        background-color: cyan;
        font-size: 25px;
        font-family: bold, serif;
    }
</style>