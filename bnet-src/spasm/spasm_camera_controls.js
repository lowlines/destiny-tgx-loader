// spasm_camera_controls.js

var Spasm = Spasm || {};

Spasm.CameraControls = function(element, camera)
{
	Spasm.assertValid(element, "invalid element");
	Spasm.assertInstance(camera, Spasm.Camera);

	this.element = element;
	this.camera = camera;

	this.allowRotationHorizontal = true;
	this.allowRotationVertical = false;

	this.allowTranslation = false;
	this.allowZoom = false;

	this.mouse =
	{
		tracking : false,
		oldX : 0.0,
		oldY : 0.0
	};

	this.touch =
	{
		tracking : false,
		count : 0,
		oldX : 0.0,
		oldY : 0.0
	};

	// events to listen for at all times
	this.staticElementEventNames = ["mousedown", "touchstart", "mousewheel", "DOMMouseScroll"];
	this.staticWindowEventNames = ["mouseup", "touchend", "touchcancel"];

	var self = this;
	this.eventListenerFunctions =
	{
		// mouse events
		mousedown : function(event)
		{
			self.onMouseDown(event);
		},
		mousemove : function(event)
		{
			self.onMouseMove(event);
		},
		mouseup : function(event)
		{
			self.onMouseUp(event);
		},
		mouseout : function(event)
		{
			self.onMouseOut(event);
		},

		// scroll events
		mousewheel : function(event)
		{
			self.onScroll(event);
		},
		DOMMouseScroll : function(event)
		{
			self.onScroll(event);
		},

		// touch events
		touchstart : function(event)
		{
			self.onTouchStart(event);
		},
		touchmove : function(event)
		{
			self.onTouchMove(event);
		},
		touchend : function(event)
		{
			self.onTouchEnd(event);
		},
		touchenter : function(event)
		{
			self.onTouchEnter(event);
		},
		touchleave : function(event)
		{
			self.onTouchLeave(event);
		},
		touchcancel : function(event)
		{
			self.onTouchCancel(event);
		}
	};

	this.addStaticElementEventListeners();
	this.addStaticWindowEventListeners();
};

Spasm.CameraControls.prototype = {};

Spasm.CameraControls.prototype.addStaticElementEventListeners = function()
{
	var element = this.element;
	var eventListenerFunctions = this.eventListenerFunctions;

	var staticElementEventNames = this.staticElementEventNames;
	var staticElementEventCount = staticElementEventNames.length;
	for (var staticElementEventIndex = 0; staticElementEventIndex < staticElementEventCount; staticElementEventIndex++)
	{
		var staticElementEventName = staticElementEventNames[staticElementEventIndex];
		var staticElementEventFunction = eventListenerFunctions[staticElementEventName];

		element.addEventListener(staticElementEventName, staticElementEventFunction, false);
	}
};

Spasm.CameraControls.prototype.addStaticWindowEventListeners = function()
{
	var eventListenerFunctions = this.eventListenerFunctions;

	var staticWindowEventNames = this.staticWindowEventNames;
	var staticWindowEventCount = staticWindowEventNames.length;
	for (var staticWindowEventIndex = 0; staticWindowEventIndex < staticWindowEventCount; staticWindowEventIndex++)
	{
		var staticWindowEventName = staticWindowEventNames[staticWindowEventIndex];
		var staticWindowEventFunction = eventListenerFunctions[staticWindowEventName];

		window.addEventListener(staticWindowEventName, staticWindowEventFunction, false);
	}
};

// mouse events

Spasm.CameraControls.prototype.onMouseDown = function(event)
{
	Spasm.assertDOMEvent(event);

	var mouse = this.mouse;
	mouse.tracking = true;
	mouse.oldX = event.clientX;
	mouse.oldY = event.clientY;

	event.preventDefault();
	window.addEventListener("mousemove", this.eventListenerFunctions.mousemove, false);
};

Spasm.CameraControls.prototype.onMouseMove = function(event)
{
	Spasm.assertDOMEvent(event);

	var mouse = this.mouse;
	var camera = this.camera;

	if (mouse.tracking)
	{
		var currentX = event.clientX;
		var currentY = event.clientY;

		var oldX = mouse.oldX;
		var oldY = mouse.oldY;

		var deltaX = currentX - oldX;
		var deltaY = currentY - oldY;

		if (event.shiftKey && this.allowTranslation)
		{
			camera.userTranslate(deltaX, deltaY);
		}
		else
		{
			this.rotate(deltaX, deltaY);
		}

		mouse.oldX = currentX;
		mouse.oldY = currentY;

		event.preventDefault();
	}
};

Spasm.CameraControls.prototype.onMouseUp = function(event)
{
	Spasm.assertDOMEvent(event);

	this.mouse.tracking = false;
	window.removeEventListener("mousemove", this.eventListenerFunctions.mousemove, false);
};

Spasm.CameraControls.prototype.onMouseOut = function(event)
{
	Spasm.assertDOMEvent(event);

	// we don't care about mouseout events
};

// scroll events

Spasm.CameraControls.prototype.onScroll = function(event)
{
	Spasm.assertDOMEvent(event);

	if (this.allowZoom)
	{
		var scrollDelta = 0.0;
		if (event.wheelDelta)
		{
			scrollDelta = event.wheelDelta;
		}
		else if (event.detail)
		{
			// $HACK multiply by -40.0 to match wheelData scale (-3 -> 120)
			scrollDelta = event.detail * -40.0;
		}

		var camera = this.camera;
		camera.userZoom(scrollDelta);

		event.preventDefault();
	}
};

// touch events

Spasm.CameraControls.prototype.onTouchStart = function(event)
{
	Spasm.assertDOMEvent(event);

	var eventTouches = event.touches;
	if (eventTouches
		&& eventTouches.length === 1)
	{
		var eventTouch = eventTouches[0];

		var touchX = eventTouch.clientX;
		var touchY = eventTouch.clientY;

		var touch = this.touch;
		touch.tracking = true;
		touch.oldX = touchX;
		touch.oldY = touchY;

		window.addEventListener("touchmove", this.eventListenerFunctions.touchmove, false);
	}
};

Spasm.CameraControls.prototype.onTouchMove = function(event)
{
	Spasm.assertDOMEvent(event);

	var touch = this.touch;
	var eventTouches = event.touches;
	if (touch.tracking
		&& eventTouches
		&& eventTouches.length > 0)
	{
		var eventTouch = eventTouches[0];

		var touchX = eventTouch.clientX;
		var touchY = eventTouch.clientY;

		var deltaX = touchX - touch.oldX;
		var deltaY = touchY - touch.oldY;

		if (eventTouches.length === 1)
		{
			// only rotate if one touch is tracking
			this.rotate(deltaX, deltaY);
		}

		touch.oldX = touchX;
		touch.oldY = touchY;

		event.preventDefault();
	}
};

Spasm.CameraControls.prototype.onTouchEnd = function(event)
{
	Spasm.assertDOMEvent(event);

	var eventTouches = event.touches;
	if (!eventTouches
		|| eventTouches.length <= 1)
	{
		var touch = this.touch;
		touch.tracking = false;

		window.removeEventListener("touchmove", this.eventListenerFunctions.touchmove, false);
	}
};

Spasm.CameraControls.prototype.onTouchEnter = function(event)
{
	Spasm.assertDOMEvent(event);
};

Spasm.CameraControls.prototype.onTouchLeave = function(event)
{
	Spasm.assertDOMEvent(event);
};

Spasm.CameraControls.prototype.onTouchCancel = function(event)
{
	Spasm.assertDOMEvent(event);

	var eventTouches = event.touches;
	if (!eventTouches
		|| eventTouches.length <= 1)
	{
		var touch = this.touch;
		touch.tracking = false;

		window.removeEventListener("touchmove", this.eventListenerFunctions.touchmove, false);
	}
};

Spasm.CameraControls.prototype.rotate = function(deltaX, deltaY)
{
	Spasm.assertNumber(deltaX);
	Spasm.assertNumber(deltaY);

	if (this.allowRotationHorizontal
		|| this.allowRotationVertical)
	{
		var rotationHorizontal = this.allowRotationHorizontal ? deltaX : 0.0;
		var rotationVertical = this.allowRotationVertical ? deltaY : 0.0;

		this.camera.userRotate(rotationHorizontal, rotationVertical);
	}
};
