<template>
<v-container>
    <v-btn @click="$router.push('/')" center color="yellow">
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
                <v-simple-table>
                    <template v-slot:default>
                    <thead>
                        <tr>
                        <th id="field" class="text-left">
                            Field
                        </th>
                        <th id="type" class="text-left">
                            Type
                        </th>
                        </tr>
                    </thead>
                    <tbody v-if="fields">
                        <tr class="text-left"
                        v-for="field in Object.keys(fields)"
                        :key="field"
                        >
                        <td>{{ field }}</td>
                        <td>{{ fields[field] }}</td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
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
        fields : null,
        fileTypesSupported : [
            "application/json",
            "application/geo+json",
            "text/csv",
        ],
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
            else if(this.fileTypesSupported.includes(this.fileType)){
                reader.readAsText(files[0]);
            }
            else{
                alert(`Sorry, type ${this.fileType} not supported: only CSV, Json and Geojon are for the moment`)
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
        /// GET THE DATA OF data() Observer : JSON.parse(JSON.stringify(obj))
        parseDataset(dataset){
            switch(this.fileType) {
                case "application/json" : {
                    this.dataParsed = [];
                    let nbFields = 0;
                        if(!("features" in JSON.parse(dataset))){
                            for(let i of JSON.parse(dataset)){
                                this.dataParsed.push(i);
                                if(Object.keys(i).length > nbFields){
                                    nbFields = Object.keys(i).length;
                                    this.fields = {}; 
                                    for(let f in i){
                                        this.fields[f] = typeof i[f];
                                    }
                                }
                            }
                        }
                        else {
                            for(let i of JSON.parse(dataset).features){
                                this.dataParsed.push(i.properties);
                                if(Object.keys(i.properties).length > nbFields){
                                    nbFields = Object.keys(i.properties).length;
                                    this.fields = {};
                                    for(let f in i.properties){
                                        this.fields[f] = typeof i.properties[f];
                                    }
                                }
                            }
                        }
                    break;
                }
                case "text/csv" : {
                    this.dataParsed = [];
                    const columns = dataset[0];
                    let fields = {};
                    for(let i of dataset){
                        const feature = {};
                        if(columns != i){
                            i.forEach((el, index) => {
                                feature[columns[index]] = el;
                            });
                            if(!Object.keys(fields).length > 0 && columns.length == i.length){
                                i.forEach((el, index) => {
                                fields[columns[index]] = typeof el;
                            });
                            }
                        }
                        this.dataParsed.push(feature);
                    }
                    this.fields = fields;
                    break;
                }
                case "application/geo+json" : {
                    const features = JSON.parse(dataset).features;
                    const featuresProperties = [];
                    let nbFields = 0;
                    for(let i of features){
                        featuresProperties.push(i.properties);
                        if(Object.keys(i.properties).length > nbFields){
                            nbFields = Object.keys(i.properties).length;
                            this.fields = {}; 
                            for(let f in i.properties){
                                this.fields[f] = typeof i.properties[f]
                            }
                        }
                    }
                    this.dataParsed = featuresProperties;
                    break;
                }
                default: alert("File not supported")
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