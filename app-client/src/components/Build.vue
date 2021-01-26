<template>
<v-container>
    <v-btn @click="$router.push('/')" center color="success">
        Return home
    </v-btn>
    <v-row class="text-center">
        <v-col class="mb-4">
              <h1>BUILD</h1>
        </v-col>
    </v-row>
</v-container>
</template>

<script>
export default {
    name : "Build",
}
</script>

<style>

</style>