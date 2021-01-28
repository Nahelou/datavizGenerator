<template>
    <v-container>
      <h1 class="font-weight-light mb-10" >Bubble Plot</h1>
          <v-select :items="Object.keys(featuresFields)" label="x value" @change="getXValue" >
          </v-select>
          <v-select :items="Object.keys(featuresFields)" label="y value" @change="getYValue" >
          </v-select>
          <v-select :items="Object.keys(featuresFields)" label="Label" @change="getLabelValue" >
          </v-select>
          <v-select :items="Object.keys(featuresFields)" label="Size" @change="getSizeValue" >
          </v-select>
          <div v-if="!isPackedData">
             <label for="colorpicker" class="mb-5" >Color :</label>
             <input type="color" id="colorpicker" value="#0066ff" @change="changeColor" >
          </div>
                 <v-checkbox
      label="Color based on a field" 
      @change="isPacked"></v-checkbox>
          <v-select v-if="isPackedData" :items="Object.keys(featuresFields)" label="Color field" @change="setPackingField" >
          </v-select>
          
        <v-btn @click="processDataviz" right color="success" class="mb-10">
            Process
       </v-btn>
       <canvas id="bubbleChart"></canvas>
    </v-container>
</template>

<script>
import Chart from "chart.js";
import * as d3 from "d3";
export default {
  name: "Bubble",
  dataOthers: null,
  props: {
    dataParsed: {
      type: Array,
    },
    fields: {
      type: Object,
    }
  },
  dataInOut: null,
  bubbleChartData: null,
  data() {
    return {
        dataArray: this.$props.dataParsed,
        featuresFields: this.$props.fields,
        fieldX: null,
        fieldY: null,
        fieldLabel: null,
        fieldSize: null,
        color: "rgba(0, 102, 255,.5)",
        isPackedData : false,
        packingField: null,
        };
  },
  created() {
    this.dataArray = this.$props.dataParsed;
    this.featuresFields= this.$props.fields;
  },
  mounted() {
  },
  methods: {
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      });
    },
    getChartData(){
      // let data = [];
      // let dataToScale = [];
      let that = this;
      // for(let i = 0; i < this.dataArray.length; i++){
      //     let dataOthers = {};
      //     dataOthers.y = this.dataArray[i][this.fieldY];
      //     dataOthers.x = this.dataArray[i][this.fieldX];
      //     dataOthers.label = this.dataArray[i][this.fieldLabel];
      //     dataOthers.pass = this.dataArray[i][this.fieldSize];
      //     dataToScale.push(this.dataArray[i][this.fieldSize]);
      //     data.push(dataOthers);
      // }
      // let maxOut = d3.max(Object.values(dataToScale));
      // let meanOut = d3.mean(Object.values(dataToScale));
      // let minOut = d3.min(Object.values(dataToScale));
      // let valued3 = d3
      //     .scaleLinear(10)
      //     .domain([minOut, meanOut, maxOut])
      //     .range([5, 10, 20, 50]);
      // for(let j=0; j<data.length;j++){
      //   data[j].r = valued3(data[j].pass);
      // }
      // this.dataOthers = data;
      let d = that.getDatasetsForChart();
      this.bubbleChartData = {
      type: "bubble",
      data: {
        datasets: d,
      },
        options: {
          legend: {
            labels: {
                fontColor: 'black'
            }},
          responsive: true,
          lineTension: 1,
          scales: {
            yAxes: [
              {
                scaleLabel : {
                  display: true,
                  labelString: this.fieldY,
                  fontColor: 'black'
                },
                ticks: {
                  beginAtZero: false,
                  padding: 25,
                  fontColor: 'black'
                },
              },
            ],
            xAxes: [
              {
                scaleLabel :{
                  display: true,
                  labelString: this.fieldX,
                  fontColor: 'black'
                },
                ticks: {
                  fontColor: 'black'
                },
              },
            ],
          },
          tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                  let test = null;
                  data.datasets[tooltipItem.datasetIndex].data.forEach((e)=>{
                    if(e.x == parseFloat(tooltipItem.xLabel) && e.y == parseFloat(tooltipItem.yLabel)){
                      test = e;
                    }
                  });
                    var label = test.label || ' : <br>' + test.x + ' : ' + test.pass;
                    if (label) {
                        label += ': ';
                    }
                    label += that.fieldX + " : " + test.x;
                    label += ";" + that.fieldY + " : " + test.y;
                    return label;
                },
            },
            enabled: false,
            custom: function(tooltipModel) {
                var tooltipEl = document.getElementById('chartjs-tooltip');
                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'chartjs-tooltip';
                    tooltipEl.innerHTML = '<table></table>';
                    document.body.appendChild(tooltipEl);
                }
                if (tooltipModel.opacity === 0) {
                    tooltipEl.style.opacity = 0;
                    return;
                }
                tooltipEl.classList.remove('above', 'below', 'no-transform');
                if (tooltipModel.yAlign) {
                    tooltipEl.classList.add(tooltipModel.yAlign);
                } else {
                    tooltipEl.classList.add('no-transform');
                }
                function getBody(bodyItem) {
                    return bodyItem.lines;
                }
                if (tooltipModel.body) {
                    var titleLines = tooltipModel.title || [];
                    var bodyLines = tooltipModel.body.map(getBody);
                    var innerHtml = '<thead>';
                    titleLines.forEach(function(title) {
                        innerHtml += '<tr><th>' + title + '</th></tr>';
                    });
                    innerHtml += '</thead><tbody>';
                    bodyLines.forEach(function(body, i) {
                        var colors = tooltipModel.labelColors[i];
                        var style = 'background:' + colors.backgroundColor;
                        style += '; border-color:' + colors.borderColor;
                        style += '; border-width: 2px';
                        var span = '<span style="' + style + '"></span>';
                        innerHtml += '<tr><td>' + span + body + '</td></tr>';
                    });
                    innerHtml += '</tbody>';
                    var tableRoot = tooltipEl.querySelector('table');
                    tableRoot.innerHTML = innerHtml;
                }
                var position = this._chart.canvas.getBoundingClientRect();
                tooltipEl.style.opacity = 1;
                tooltipEl.style.backgroundColor = "white";
                tooltipEl.style.position = 'absolute';
                tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                tooltipEl.style.pointerEvents = 'none';
            }
        },
        },
      };
    },
    getXValue(e){
      this.fieldX = e;
    },
    getYValue(e){
      this.fieldY = e;
    },
    getLabelValue(e){
      this.fieldLabel = e;
    },
    getSizeValue(e){
      this.fieldSize = e;
    },
    getColors(e){
      this.colors = [];
      for(let i = 0; i<e.length; i++){
        this.colors.push(this.color)
      }
    },
    hexToRgbA(hex){
      var c;
      if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
          c= hex.substring(1).split('');
          if(c.length== 3){
              c= [c[0], c[0], c[1], c[1], c[2], c[2]];
          }
          c= '0x'+c.join('');
          return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.5)';
      }
      throw new Error('Bad Hex');
    },
    changeColor(e){
      let color = e.target.value || e.srcElement.value;
      this.color = this.hexToRgbA(color);
    },
    processDataviz(){
      this.getColors(this.dataArray);
      this.getChartData();
      document.getElementById("bubbleChart").innerHTML = "";
      this.createChart("bubbleChart", this.bubbleChartData);
    },
    setPackingField(e){
      this.packingField = e;
      this.packingFieldData = new Set();
      for(let i = 0; i < this.dataArray.length; i++){
        if(this.dataArray[i][e]){
          this.packingFieldData.add(this.dataArray[i][e]);
        }
      }
    },
    isPacked(){
      if(this.packingField){
        this.packingField = null;
      }
      this.isPackedData = !this.isPackedData;
    },
    getDatasetsForChart(){
      let datasets = [];
      let dataToScale = [];
      if(this.packingField == null){
        for(let i = 0; i < this.dataArray.length; i++){
          let dataOthers = {};
          dataOthers.y = this.dataArray[i][this.fieldY];
          dataOthers.x = this.dataArray[i][this.fieldX];
          dataOthers.label = this.dataArray[i][this.fieldLabel];
          dataOthers.pass = this.dataArray[i][this.fieldSize];
          dataToScale.push(this.dataArray[i][this.fieldSize]);
          datasets.push(dataOthers);
        }
        let maxOut = d3.max(Object.values(dataToScale));
        let meanOut = d3.mean(Object.values(dataToScale));
        let minOut = d3.min(Object.values(dataToScale));
        let valued3 = d3
            .scaleLinear(10)
            .domain([minOut, meanOut, maxOut])
            .range([5, 10, 20, 50]);
        for(let j=0; j<datasets.length;j++){
          datasets[j].r = valued3(datasets[j].pass);
        }
        this.dataOthers = datasets;
        let dataset = [
        {
          label:"Dataset",
          data : datasets,
          backgroundColor: this.colors,
              borderColor: [],
              borderWidth: 1,
          },
        ];
        console.log(dataset);
        return dataset;
      }
      else{
        let datasetsPackedToChartProp = [];
        let datasetPacked =  {};
        this.packingFieldData.forEach(field => {
          datasetPacked[field] = [];
        })

        for(let i = 0; i < this.dataArray.length; i++){
          let dataPacked = {};
          dataPacked.y = this.dataArray[i][this.fieldY];
          dataPacked.x = this.dataArray[i][this.fieldX];
          dataPacked.label = this.dataArray[i][this.fieldLabel];
          dataPacked.pass = this.dataArray[i][this.fieldSize];
          dataToScale.push(this.dataArray[i][this.fieldSize]);
          if(this.dataArray[i][this.packingField]){
            datasetPacked[this.dataArray[i][this.packingField]].push(dataPacked);
          }
        }
        for(let valuePacker in datasetPacked){
          let datasetPackedToChartProp = {
            label : valuePacker,
            data : datasetPacked[valuePacker],
            backgroundColor: this.colors,
            borderColor: [],
            borderWidth: 1,
          };
          datasetsPackedToChartProp.push(datasetPackedToChartProp);
        }
        let maxOut = d3.max(Object.values(dataToScale));
        let meanOut = d3.mean(Object.values(dataToScale));
        let minOut = d3.min(Object.values(dataToScale));
        let valued3 = d3
            .scaleLinear(10)
            .domain([minOut, meanOut, maxOut])
            .range([5, 10, 20, 50]);
        for(let v in datasetPacked){
          for(let j=0; j < datasetPacked[v].length;j++){
            datasetPacked[v][j].r = valued3(datasetPacked[v][j].pass);
          }
        }
        return datasetsPackedToChartProp;
      }
    },
    getRandomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
  },
};
</script>

<style>

</style>