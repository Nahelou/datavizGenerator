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
            <v-card v-if="fileType">
                Type de fichier 
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
            console.log(event.target.result);
    }
    },
}
</script>

<style>

</style>