<template>
  <v-container>
    <v-row class="text-center">
        <v-col class="mb-4">
            <h1 class="display-2 font-weight-bold mb-3">
            Welcome to Dataviz Generator
            </h1>

            <p class="subheading font-weight-regular">
            A simple Web interface to generate dataviz based on your data.
            </p>
        </v-col>
        <v-col class="mb-5" cols="12">
            <h2 class="headline font-weight-bold mb-3">Tha Dataviz's types supported : </h2>
                    <v-select :items="filters" label="Types" v-model="filter" @change="updateDatavizExamples" >
          </v-select>
            <v-card v-for="dataviz in datavizExamples" :key="dataviz.name"> 
                <v-card-title>{{dataviz.name}}</v-card-title>
                <v-card-subtitle>{{dataviz.type}}</v-card-subtitle>
            </v-card>
        </v-col>
    </v-row>
  </v-container>
</template>

<script>
import data from "../data/dataviz_models.js"

export default {
    name : "Home",
    data: () => ({
        filter : "Correlation",
        filters : [
            "Correlation",
            "Evolution",
            "Distribution",
            "Flow",
            "Map",
            "Part of a whole",
            "Ranking"
            ], 
        datavizModels : data.datavizExamples,
        datavizExamples : null,

    }),
    created(){
        console.log(this.datavizModels);

        this.datavizExamples = this.datavizModels.filter(i => i.type == this.filter);
        console.log(this.datavizExamples);
    },
    mounted(){

    },
    methods: {
        updateDatavizExamples(e){
            this.datavizExamples = this.datavizModels.filter(i => i.type == e);
                }
    } 
}
</script>

<style>

</style>