<template>
    <v-container>
        <v-btn @click="$router.push('dataparser')" center color="yellow">
        Return at the first step
    </v-btn>
        <h1 v-if="fileType && dataset">{{fileType}} : {{dataset.length}} rows</h1>
    </v-container>
</template>

<script>
export default {
    name:"Build",
    props: {
        fileType: {
            type: String,
        },
        dataParsed: {
            type: Array,
        },
        },
    data: () => ({
        fileTypesSupported : [
            "application/json",
            "application/geo+json",
            "text/csv",
            ],
            dataset: null,
        }),
    created(){
        this.fileType = this.$props.fileType;
        this.dataset = this.$props.dataParsed;
    }
}
</script>

<style>

</style>