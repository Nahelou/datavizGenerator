<template>
    <v-container>
        <v-btn @click="$router.push('dataparser')" center color="yellow">
        Return at the first step
    </v-btn>
    <h1 v-if="fileType && dataset">{{fileType}} : {{dataset.length}} rows</h1>
    <h2 class="headline font-weight-bold mb-3">Select your dataviz : </h2>
    <div v-if="!datavizSelected">
        <v-select :items="filters" label="Type" v-model="filter" @change="updateDatavizExamples" >
          </v-select>
            <v-card v-for="dataviz in datavizExamples" :key="dataviz.name"> 
                <v-card-title>{{dataviz.name}}</v-card-title>
                <v-card-subtitle>{{dataviz.type}}</v-card-subtitle>
                        <img v-if="dataviz.img"
                        :alt="dataviz.name"
                        class="shrink mr-2"
                        contain
                        :src="dataviz.img"
                        width="500"
                        />
                <v-btn @click="selectDataviz(dataviz.id)" right color="success">
                Build {{dataviz.name}}
                </v-btn>
            </v-card>
    </div>
    <component v-if="datavizSelected" v-bind:is="component" />
    </v-container>
</template>

<script>
import data from "../data/dataviz_models.js";
import Bubble from '../views/Bubble.vue';
import Scatter from '../views/Scatter.vue';
import Histogram from '../views/Histogram.vue';
import Pie from '../views/Pie.vue';
import Line from '../views/Line.vue';


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
        datavizComponents : {
            "bubble" : Bubble,
            "scatter" : Scatter,
            "histogram" : Histogram,
            "pie" : Pie,
            "line" : Line,
        },
        datavizModels : data.datavizExamples,
        datavizExamples : null,
        dataset: null,
        datavizSelected: null,
        component: null,
        }),
    created(){
        this.fileType = this.$props.fileType;
        this.dataset = this.$props.dataParsed;
        this.datavizExamples = this.datavizModels.filter(i => i.type == this.filter);
    },
    methods: {
        updateDatavizExamples(e){
            this.datavizExamples = this.datavizModels.filter(i => i.type == e);
            },
        selectDataviz($event){
            this.component = this.datavizComponents[$event];
            this.datavizSelected = $event;
        }
    },
    components : {
        Bubble,
        Scatter,
        Histogram,
        Pie,
        Line,
    }
}
</script>

<style>

</style>