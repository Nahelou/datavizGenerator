<template>
<v-container>
    <v-btn @click="$router.push('/')" center color="success">
        Return home
    </v-btn>
    <v-row class="text-center">
        <v-col class="mb-4">
              <h1>First step : Upload your data</h1>
        </v-col>
        <v-col class="mb-5" cols="12">
            <input type="file" @change="onFileChange">
            <v-card v-if="fileType" :key="fileType">
                <v-card-title>Type de fichier :  {{ fileType }}</v-card-title>
                <p>{{ data }}</p>
            </v-card>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
// import * as d3 from "d3";


export default {
    name : "Build",
    data: () =>({
        filter : "Correlation",
        fileType : null,
        data : null,
        dataParsed : null,
    }),
    created(){

    },
    mounted(){

    },
    methods :{
        onFileChange(e){
            var files = e.target.files || e.dataTransfer.files;
            var reader = new FileReader();
            reader.onload = this.onReaderLoad;
            this.fileType = files[0].type;
            if(this.fileType == "text/csv"){
                reader.readAsBinaryString(files[0]);
            }
            else {
                reader.readAsText(files[0]);
            }
            console.log(files[0].type);
            },
        onReaderLoad(event){
            this.data = event.target.result;
            if(this.fileType == "text/csv"){
                this.parseDataset(this.parseCsv(this.data));
            }
            else{
                this.parseDataset(this.data);
            }
            },
        parseDataset(dataset){
            switch(this.fileType) {
                case "application/json" : {
                    for(let i in JSON.parse(dataset)){
                        console.log(i);
                    }
                    break;
                }
                case "text/csv" : {
                    this.dataParsed = [];
                    const columns = dataset[0];
                    for(let i of dataset){
                        const feature = {};
                        if(columns != i){
                            i.forEach((el, index) => {
                                feature[columns[index]] = el;
                            });
                        }
                        this.dataParsed.push(feature)
                    }
                    break;
                }
                case "application/geo+json" : {
                    const features = JSON.parse(dataset).features;
                    const featuresProperties = [];
                    for(let i in features){
                        featuresProperties.push(features[i].properties);
                    }
                    this.dataParsed = featuresProperties;
                }
            }
        },
        parseCsv(data){
            let parsedata = [];

            let newLinebrk = data.split("\n");
            for(let i = 0; i < newLinebrk.length; i++) {
                parsedata.push(newLinebrk[i].split(","))
            }
            return parsedata;
        },
        uploadDealcsv () {

        },
    },
}
</script>

<style>

</style>