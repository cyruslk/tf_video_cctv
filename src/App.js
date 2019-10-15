import React from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import './App.css';

class App extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
    prediction: null,
    pourcentage: null
  };
}
// create the videoRef
videoRef = React.createRef();

  detectFromVideoFrame = (model, video) => {
    model.detect(video).then(predictions => {
      this.showDetections(predictions);
      requestAnimationFrame(() => {
        this.detectFromVideoFrame(model, video);
      });
    }, (error) => {
      console.log("Couldn't start the webcam")
      console.error(error)
    });
  };

    showDetections = predictions => {

      predictions.forEach(prediction => {


        const x = prediction.bbox[0];
        const y = prediction.bbox[1];
        const width = prediction.bbox[2];
        const height = prediction.bbox[3];

        console.log(prediction);

        this.setState({
          prediction: prediction.class,
          pourcentage: prediction.score
        })
      });
    };

    componentDidMount() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // define a Promise that'll be used to load the webcam and read its frames
        const webcamPromise = navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: false,
          })
          .then(stream => {
            // pass the current frame to the window.stream
            window.stream = stream;
            // pass the stream to the videoRef
            this.videoRef.current.srcObject = stream;

            return new Promise(resolve => {
              this.videoRef.current.onloadedmetadata = () => {
                resolve();
              };
            });
          }, (error) => {
            console.log("Couldn't start the webcam")
            console.error(error)
          });

        // define a Promise that'll be used to load the model
          const loadlModelPromise = cocoSsd.load();

          // resolve all the Promises
          Promise.all([loadlModelPromise, webcamPromise])
            .then(values => {
              this.detectFromVideoFrame(values[0], this.videoRef.current);
            })
            .catch(error => {
              console.error(error);
            });
        }
      }

  render() {
    return (
     <div>
       <section>
           <h1>{this.state.prediction}</h1>
           <h1>{this.state.pourcentage}</h1>
       </section>
       <video
         style={this.styles}
         autoPlay
         muted
         ref={this.videoRef}
         width="720"
         height="600"
       />
     </div>
   );
  }
}

export default App;
