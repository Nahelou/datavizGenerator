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
            reader.readAsText(files[0]);

            console.log(files[0].type);
            },
        onReaderLoad(event){
            this.data = event.target.result;
            this.parseDataset(this.data);
            },
        parseDataset(dataset){
            switch(this.fileType) {
                case "application/json" : {
                    console.log();
                    for(let i in JSON.parse(dataset)){
                        console.log(i);
                    }
                    break;
                }
                case "text/csv" : {
                    this.dataParsed = [];
                    for(let i in dataset){
                        this.dataParsed.push(i);
                        console.log(i);
                    }
                    break;
                }
                case "application/geo+json" : {
                    const features = JSON.parse(dataset).features;
                    const featuresProperties = [];
                    for(let i in features){
                        featuresProperties.push(features[i].properties);
                    }
                    console.log(featuresProperties);
                }
            }
        }
    },
}
</script>

<style>

</style>