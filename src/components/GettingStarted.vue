<template>
  <div>
    <Col span="17">
      <h3>Getting started with Turf.js</h3>
      <p>There are a few different ways to get started using Turf, the documentation below will provide a couple of the common scenarios.</p>
      <h4>Using directly in the browser</h4>
      <p>Load the minified file via a script tag, this will expose a global variable named turf.</p>
      <prism language="javascript">&lt;script src='https://npmcdn.com/@turf/turf/turf.min.js'&gt;&lt;/script&gt;
&lt;script&gt;
    var bbox = turf.bbox(features);
&lt;/script&gt;</prism>
      <p><strong>Note:</strong> The full build of Turf weighs around 500kb which is a fair bit of javascript to load so you probably only want to pull in the bits you need, see the instructions below on how to create a custom build.</p>
      <h4>Using in Node or with a build tool</h4>
      <p>If you're working in Node or with build tool (such as webpack, browserify or rollup) you can include individual turf modules in your project.</p>
      <prism language="javascript">// Import your module of interest
var collect = require('@turf/collect');
// And then use it
collect(points, polys, 'population', 'populationValues')
</prism>

      <h4>Creating custom builds for use in the browser</h4>
      <p><strong>Step 1</strong> Create a folder and install whatever modules you are interested in via npm</p>
        <pre><code class="js">$ npm install @turf/collect @turf/buffer</code></pre>
        <p><strong>Step 2</strong> Create a file called main.js in the root directory, in this include your required modules within a modules.exports statement</p>
        <prism language="javascript">module.exports = {
    collect: require('@turf/collect'),
    buffer: require('@turf/buffer')
};</prism>
      <p><strong>Step 3</strong> Run the following browserify command</p>
      <pre><code class="js">$ browserify main.js -s turf > outTurf.js </code></pre>
      <p><strong>Done</strong> You can now use your outTurf.js file where you want just like you would normally use Turf, eg load it via a script tag and call turf using the turf global variable.</p>
    </Col>
    <Col span="6" offset="1" class="highlight">
      <h4>Examples</h4>
      <p>Below are some helpful resources for getting started with Turf.</p>

      <h5>Code Repositories</h5>
      <p><a href="https://github.com/turfjs/turf-node-example">Turf & Node.js for geoprocessing tasks</a></p><br>
      <p><a href="https://github.com/mapbox/turf-server-example">Turf & Express.js to create a spatial server</a></p>
      <h5>Guides</h5>
      <p><a href="https://www.mapbox.com/guides/intro-to-turf">Intro To Turf</a></p><br>
      <p><a href="https://www.mapbox.com/guides/analysis-with-turf">Analysis with Turf.js</a></p>
    </Col>
  </div>
</template>

<script>
import {Row, Col} from 'iview/src/components/grid'
import Prism from 'vue-prism-component'

export default {
  name: 'GettingStarted',
  components: {
    Row,
    Col,
    Prism
  }
}
</script>

<style lang="scss">
  @import "../styles/variables.scss";

  .highlight{
    background-color: $blue;
    padding: 30px 30px 50px;
    color: white;
    h4{
      color: white;
      border-bottom: 2px solid white;
      margin: 10px 0px;
    }
    h5 {
      margin-top: 30px;
      margin-bottom: 5px;
      text-transform: uppercase;
    }
    a{
      color: white;
      text-decoration: underline;
    }
  }
</style>