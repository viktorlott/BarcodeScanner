import React, { useRef, useEffect, useState, useCallback } from 'react';
import Quagga from 'quagga';
import config from './config'
import { useSelector, useDispatch } from 'react-redux'
import { PRODUCT_REQUESTED, PRODUCT_EMIT } from '../constants';
import scansound from './scansound.mp3'

function Sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function(){
	  this.sound.play();
	}
	this.stop = function(){
	  this.sound.pause();
	}
  }


function useToggle() {
	const [state, setState] = useState(false)
	const off = () => setState(false)
	const on = () => setState(true)
	return [state, {on, off}]
}

function useScanner({onStart=() => {}, onMatch=() => {} }) {
	const [state, setState] = useState({ match: false, processing: false })
	const list = useSelector(state => state.products)
	const [isPaused, pauseCTL] = useToggle()
	const scanner = useRef()
	const codes = useRef({})
	const sound = useRef()
	const isDisabled = useRef()
	const dispatch = useDispatch()


	const test2 = useSelector(state => state.rooms)

	console.log(test2)



	useEffect(() => {
		isDisabled.current = false
		sound.current = new Sound(scansound)
		const cb = err => {
			if (err) {
				console.log(err);
				return
			}
	
			Quagga.start();
			onStart && onStart()
	
			Quagga.onProcessed(processed)
			// Quagga.offProcessed(offProcessed)
	
			Quagga.onDetected(detected)
			// Quagga.offDetected(offDetected)
	
		}

		Quagga.init(config({ target: scanner.current }), cb);

		return () => void Quagga.stop()
	}, [])



	const emitBarcode = useCallback(data => void dispatch({ type: PRODUCT_EMIT, payload: data.codeResult}), [])
	const fetchBarcodeProduct = useCallback(data =>  void dispatch({ type: PRODUCT_REQUESTED, payload: data.codeResult}), [])


	const detected = useCallback(data => {
		if(isDisabled.current) return
		if (codes.current[data.codeResult.code] >= 3) {
			sound.current.play()
			let drawingCtx = Quagga.canvas.ctx.overlay,
			drawingCanvas = Quagga.canvas.dom.overlay;
			drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));

			emitBarcode(data)
			// fetchBarcodeProduct(data)

			setState(prev => ({...prev, match: data.codeResult }))
			codes.current = {}

			pauseCTL.on()
			isDisabled.current = true


			
		}

		if (!codes.current[data.codeResult.code]) codes.current[data.codeResult.code] = 0
		codes.current[data.codeResult.code] += 1

	}, [onMatch, isDisabled])


	const processed = useCallback(result => {
		if(isDisabled.current) return
        let drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
				drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    // Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "#00FF00", lineWidth: 2});
                });
            }

            // if (result.box) {
            //     Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00FF00", lineWidth: 1});
            // }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: '#FF4500', lineWidth: 4});
            }
        }
	}, [isDisabled])

	const start = useCallback(() => {
		setState({ match: false, processing: false })
		isDisabled.current = false
		pauseCTL.off()
	}, [])

	const stop = useCallback(() => Quagga.stop(), [])

	const bind = { ref: scanner }
	const ctl = { start, stop, isPaused, list, pauseCTL }

	return [bind, state, ctl]

}

export default useScanner;
