sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/MessageToast",
	"App/CameraFunctionality/js/Download"
], function (Controller, Dialog, Button, MessageToast,Download) {
	"use strict";

	return Controller.extend("App.CameraFunctionality.controller.ImageCapture", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf App.CameraFunctionality.view.ImageCapture
		 */
		onInit: function () {

		},
		capturePic: function () {
			var that = this;
			this.cameraDialog = new Dialog({
				title: "Click on Capture to take a photo",
				beginButton: new Button({
					text: "Capture",
					press: function (oEvent) {
						that.imageValue = document.getElementById("player");
						var oButton = oEvent.getSource();
						that.imageText = oButton.getParent().getContent()[1].getValue();
						that.cameraDialog.close();
					}
				}),
				content: [
					new sap.ui.core.HTML({
						content: "<video id='player' autoplay></video>"
					}),
					new sap.m.Input({
						placeholder: "Please input image text here",
						required: true
					})
				],
				endButton: new Button({
					text: "Cancel",
					press: function () {
						that.cameraDialog.close()
					}
				})
			});

			this.getView().addDependent(this.cameraDialog);
			this.cameraDialog.open();
			this.cameraDialog.attachBeforeClose(this.setImage, this);
			var player = document.getElementById("player");
			navigator.mediaDevices.getUserMedia({
				video: true
			}).then(function (stream) {
				player.srcObject = stream
			});

		},
		setImage: function () {
			var oVBox = this.getView().byId("vbox1");
			var oItems = oVBox.getItems();
			var imageId = "archie-" + oItems.length;

			var fileName = this.imageText;
			var imageValue = this.imageValue;
			if (imageValue == null) {
				MessageToast.show("No image captured");
			} else {
				var oCanvas = new sap.ui.core.HTML({
					content: "<canvas id='" + imageId + "'width='320px' height='320px'" + "style = '2px solid red'></canvas>"
				});
				var snapShotCanvas;
				oVBox.addItem(oCanvas);
				oCanvas.addEventDelegate({
					onAfterRendering: function () {
						snapShotCanvas = document.getElementById(imageId);
						var oContext = snapShotCanvas.getContext('2d');
						oContext.drawImage(imageValue, 0, 0, snapShotCanvas.width, snapShotCanvas.height);
						var imageData = snapShotCanvas.toDataURL('image/png');
						var imageBase64 = imageData.substring(imageData.indexOf(",") + 1)
						// window.open(imageData);
						download(imageData, fileName + ".png", "image/png");
					}
				})

			}
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf App.CameraFunctionality.view.ImageCapture
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf App.CameraFunctionality.view.ImageCapture
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf App.CameraFunctionality.view.ImageCapture
		 */
		//	onExit: function() {
		//
		//	}

	});

});