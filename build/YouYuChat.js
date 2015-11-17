/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "b2189326ad1f05c6f59b"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				fn[name] = __webpack_require__[name];
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(3);
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(2);
	module.exports = __webpack_require__(8);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var YouYuChatState, youyu_chat_state;

	YouYuChatState = __webpack_require__(2);

	youyu_chat_state = new YouYuChatState;

	module.exports = function() {
	  var YouYuChatBase;
	  return YouYuChatBase = {
	    baseState: (function() {
	      return {
	        set: function(key, value) {
	          return youyu_chat_state[key] = value;
	        },
	        get: function(key) {
	          return youyu_chat_state[key];
	        }
	      };
	    })(),
	    createRealtime: function(client_id) {
	      var result;
	      if (!_.isUndefined(client_id)) {
	        this.baseState.set("client_id", client_id);
	      }
	      result = AV.realtime({
	        appId: this.baseState.get('appid'),
	        clientId: this.baseState.get('room_name') + ':' + this.baseState.get("client_id"),
	        secure: false
	      });
	      this.baseState.set("realtime", result);
	      return result;
	    },
	    getConversation: function() {
	      var conv, promise, q;
	      promise = new AV.Promise;
	      AV.initialize(this.baseState.get('appid'), this.baseState.get('secret'));
	      conv = AV.Object.extend('_conversation');
	      q = new AV.Query(conv);
	      q.equalTo('attr.room_id', this.baseState.get('room_name'));
	      q.find({
	        success: (function(_this) {
	          return function(response) {
	            var conv_id, ref;
	            conv_id = ((ref = response[0]) != null ? ref.id : void 0) || "null";
	            _this.baseState.set("members", response[0].attributes.m);
	            _this.baseState.set("conv_id", conv_id);
	            $(document).trigger("conversation_id:Got");
	            return promise.resolve(conv_id);
	          };
	        })(this),
	        error: (function(_this) {
	          return function(err) {
	            return promise.reject(err);
	          };
	        })(this)
	      });
	      return promise;
	    },
	    connectRoom: function() {
	      var promise, realtime;
	      promise = new AV.Promise;
	      this.createRealtime();
	      realtime = this.baseState.get('realtime');
	      return realtime.on('open', (function(_this) {
	        return function() {
	          return realtime.room(_this.baseState.get('conv_id'), function(room) {
	            _this.baseState.set("room", room);
	            $(document).trigger("room:connected");
	            return promise.resolve(room);
	          });
	        };
	      })(this));
	    },
	    createRoom: function(room_name, client_id) {
	      var promise, realtime;
	      promise = new AV.Promise;
	      this.createRealtime(client_id);
	      realtime = this.baseState.get("realtime");
	      this.baseState.set("room_name", room_name);
	      this.baseState.set("client_id", client_id);
	      return realtime.on('open', (function(_this) {
	        return function() {
	          return realtime.room({
	            name: _this.baseState.get('room_name'),
	            attr: {
	              room_id: _this.baseState.get('room_name')
	            },
	            members: [_this.baseState.get('room_name') + ":" + _this.baseState.get("client_id")]
	          }, function(room) {
	            _this.baseState.set('room', room);
	            $(document).trigger("room:created");
	            return promise.resolve(room);
	          });
	        };
	      })(this));
	    },
	    closeRealTime: function(realtime) {
	      var promise;
	      promise = new AV.Promise;
	      realtime.close();
	      realtime.on('close', function() {
	        promise.resolve();
	        return $(document).trigger("realtime:closed");
	      });
	      return promise;
	    },
	    getLog: function(room) {
	      var promise;
	      promise = new AV.Promise;
	      this.baseState.set('room', room);
	      if (this.baseState.get('logFlag')) {
	        return;
	      } else {
	        this.baseState.set('logFlag', true);
	      }
	      room.log({
	        t: this.baseState.get('msgTime')
	      }, (function(_this) {
	        return function(data) {
	          var l;
	          _this.baseState.set('logFlag', false);
	          l = data.length;
	          if (l) {
	            _this.baseState.set('msgTime', data[0].timestamp);
	            data.reverse();
	          }
	          _this.baseState.set('log', data);
	          $(document).trigger("log:got");
	          return promise.resolve(data);
	        };
	      })(this));
	      return promise;
	    },
	    clearRoomMembers: function(room) {
	      return room.list(function(data) {
	        return room.remove(data, function() {
	          return console.log("clearn room members");
	        });
	      });
	    }
	  };
	};


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = function() {
	  var YouYuChatState;
	  return YouYuChatState = {
	    appid: "2PKFqnCxPQ8DWMK2uiRWsQpz",
	    secret: "Db8UOjtkzPgG1RrRHJSOPfth",
	    msgTime: void 0,
	    logFlag: false,
	    log: [],
	    room_name: "qiniuLive",
	    room: void 0,
	    client_id: "游客",
	    realtime: void 0,
	    conv_id: void 0,
	    members: [],
	    notalk: false,
	    white_list: {},
	    white_list_open: true
	  };
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var YouYuChatBase, base;

	YouYuChatBase = __webpack_require__(1);

	base = new YouYuChatBase;

	module.exports = function() {
	  var YouYuChatUtil;
	  return YouYuChatUtil = {
	    elements: function() {
	      return {
	        body: $("body"),
	        printWall: $("#printWall"),
	        sendMsgBtn: $("#btnSend"),
	        inputSend: $("#chatInput"),
	        inputNickName: $("#inputNickName"),
	        confirmName: $("#confirmName"),
	        changeName: $("#changeName"),
	        chatArea: $(".chat-area"),
	        modalDialog: $(".modal-dialog")
	      };
	    },
	    templates: function() {
	      return {
	        showlog: $("#showlog"),
	        showmsg: $("#showmsg"),
	        showsystemmsg: $("#showsystemmsg"),
	        showmymsg: $("#showmymsg"),
	        showinfo: $("#showinfo")
	      };
	    },
	    template: function($template, obj) {
	      var template;
	      template = $template.html();
	      return _.template(template)(obj);
	    },
	    isVisitor: function() {
	      var blacklist;
	      blacklist = ["游客", ""];
	      if (_.indexOf(blacklist, base.baseState.get('client_id')) !== -1) {
	        return true;
	      }
	      return false;
	    },
	    timeoutPromise: function(promise, ms) {
	      var delayPromise, timeout_promise;
	      delayPromise = function() {
	        return new AV.Promise(function(resolve) {
	          return setTimeout(resolve, ms);
	        });
	      };
	      timeout_promise = delayPromise(ms).then(function() {
	        return Promise.reject(new Error("请求超时"));
	      });
	      return AV.Promise.race([promise, timeout_promise]);
	    },
	    formatTime: function(time) {
	      var date;
	      date = new Date(time);
	      return $.format.date(date, "hh:mm:ss");
	    },
	    renderToPrintWall: function(template, isBefore) {
	      var printWall;
	      printWall = this.elements().printWall;
	      printWall.scrollTop(printWall[0].scrollHeight);
	      if (isBefore) {
	        $(template).insertBefore(printWall.children()[0]);
	      } else {
	        printWall.append(template);
	      }
	      return this.scrollToBottomPrintWall();
	    },
	    showInfo: function(msg) {
	      var template;
	      template = this.template(this.templates().showinfo, {
	        msg: msg
	      });
	      return this.renderToPrintWall(template);
	    },
	    showLog: function(msg, isBefore) {
	      var template;
	      template = this.template(this.templates().showlog, {
	        msg: this.encodeHTML(msg)
	      });
	      return this.renderToPrintWall(template, isBefore);
	    },
	    encodeHTML: function(source) {
	      return String(source).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	    },
	    isEmptyString: function(string) {
	      if (String(string).replace(/^\s+/, '').replace(/\s+$/, '') !== "") {
	        return false;
	      }
	      return true;
	    },
	    clearInput: function() {
	      return this.elements().inputSend.val('');
	    },
	    scrollToBottomPrintWall: function() {
	      var printWall;
	      printWall = this.elements().printWall;
	      return printWall.scrollTop(printWall[0].scrollHeight);
	    },
	    showMsg: function(data, isBefore) {
	      var from, from_name, template, text;
	      text = '';
	      from = data.fromPeerId;
	      from_name = from.split(":")[1];
	      from_name = this.parseClientIdToName(from_name);
	      if (data.msg.type) {
	        text = data.msg.text;
	      } else {
	        text = data.msg;
	      }
	      if (!this.isEmptyString(text)) {
	        template = this.template(this.templates().showmsg, {
	          msg_time: this.formatTime(data.timestamp),
	          from_name: this.encodeHTML(from_name),
	          text: this.encodeHTML(text)
	        });
	        return this.renderToPrintWall(template, isBefore);
	      }
	    },
	    showMyMsg: function(data, text, isBefore) {
	      var template;
	      template = this.template(this.templates().showmymsg, {
	        msg_time: this.formatTime(data.t),
	        from_name: this.parseClientIdToName(base.baseState.get('client_id')),
	        text: this.encodeHTML(text)
	      });
	      return this.renderToPrintWall(template, isBefore);
	    },
	    showBroadCast: function(notice, isBefore) {
	      return this.renderToPrintWall(notice.msg.text, isBefore);
	    },
	    showSystemMsg: function(data, isBefore) {
	      var template, text;
	      if (data.msg.type) {
	        text = data.msg.text;
	      } else {
	        text = data.msg;
	      }
	      template = this.template(this.templates().showsystemmsg, {
	        text: text
	      });
	      return this.renderToPrintWall(template, isBefore);
	    },
	    showChatLog: function() {
	      var log, printWall;
	      log = base.baseState.get('log');
	      printWall = this.elements().printWall;
	      return _.each(log, (function(_this) {
	        return function(log) {
	          if (_this.parseMsgLevel(log) === "member") {
	            return _this.showMsg(log, true);
	          } else {
	            return _this.showSystemMsg(log, true);
	          }
	        };
	      })(this));
	    },
	    parseClientIdToName: function(client_id) {
	      var name, white_list, white_list_open;
	      white_list_open = base.baseState.get('white_list_open');
	      white_list = base.baseState.get('white_list');
	      if (white_list_open) {
	        name = white_list[client_id];
	        if (_.isUndefined(name)) {
	          return client_id;
	        }
	        return name;
	      } else {
	        return client_id;
	      }
	    },
	    refreshPage: function(data) {
	      if (data.msg.attr.reload) {
	        return window.location.reload();
	      } else if (data.msg.attr.userReload === base.baseState.get('client_id')) {
	        return window.location.reload();
	      }
	    },
	    parseMsgLevel: function(data) {
	      return data.msg.attr.msgLevel;
	    },
	    getKeyByValue: function(obj, v) {
	      var keys;
	      keys = _.map(obj, function(value, key) {
	        if (value === v) {
	          return key;
	        }
	      });
	      return _.compact(keys)[0];
	    },
	    inWhiteList: function(code) {
	      return _.has(base.baseState.get("white_list"), code);
	    }
	  };
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var YouYuChatBase, YouYuChatUtil, base, util;

	YouYuChatBase = __webpack_require__(1);

	YouYuChatUtil = __webpack_require__(3);

	util = new YouYuChatUtil;

	base = new YouYuChatBase;

	module.exports = function() {
	  var YouYuChatCheatCode;
	  return YouYuChatCheatCode = {
	    getCheatCode: function() {
	      var cheatCode, q;
	      cheatCode = AV.Object.extend("CheatCode");
	      q = new AV.Query(cheatCode);
	      q.equalTo("objectId", "563c9abb60b2c82f2b951424");
	      return q.find({
	        success: (function(_this) {
	          return function(res) {
	            base.baseState.set('notalk', res[0].attributes.notalk);
	            base.baseState.set('auth_code', res[0].attributes.auth_code);
	            base.baseState.set('cheat_code_token', res[0].attributes.token);
	            base.baseState.set('white_list', res[0].attributes.white_list);
	            base.baseState.set('white_list_open', res[0].attributes.white_list_open);
	            return base.baseState.set('broad_cast', res[0].attributes.broad_cast);
	          };
	        })(this)
	      });
	    },
	    setCheatCode: function(commnad, attr, permit) {
	      var code, key, room, text, white_list;
	      permit || (permit = "");
	      if (md5(permit) === base.baseState.get("cheat_code_token")) {
	        code = AV.Object.createWithoutData('CheatCode', "563c9abb60b2c82f2b951424");
	        switch (commnad) {
	          case "shutup":
	            base.baseState.set('notalk', false);
	            code.set('notalk', attr);
	            if (attr) {
	              text = "管理员开启了全员禁言";
	            } else {
	              text = "管理员关闭了全员禁言";
	            }
	            return code.save({
	              success: function() {
	                return base.baseState.get('room').send({
	                  text: text,
	                  attr: {
	                    msgLevel: "system"
	                  }
	                }, {
	                  type: 'text'
	                }, function(data) {
	                  util.clearInput();
	                  data.msg = text;
	                  return util.showSystemMsg(data);
	                });
	              }
	            });
	          case "changeAuthCode":
	            code.set('auth_code', md5(attr));
	            text = "授权码被改变页面将会被重新载入";
	            return code.save({
	              success: function() {
	                return base.baseState.get('room').send({
	                  text: text,
	                  attr: {
	                    msgLevel: "system",
	                    reload: true
	                  }
	                }, {
	                  type: 'text'
	                }, function(data) {
	                  util.refreshPage({
	                    msg: {
	                      attr: {
	                        reload: true
	                      }
	                    }
	                  });
	                  util.clearInput();
	                  data.msg = text;
	                  return util.showSystemMsg(data);
	                });
	              }
	            });
	          case "changeToken":
	            code.set('token', md5(attr));
	            text = "Token被改变页面即将重新载入";
	            return code.save({
	              success: function() {
	                return base.baseState.get('room').send({
	                  text: text,
	                  attr: {
	                    msgLevel: "system",
	                    reload: true
	                  }
	                }, {
	                  type: 'text'
	                }, function(data) {
	                  util.refreshPage({
	                    msg: {
	                      attr: {
	                        reload: true
	                      }
	                    }
	                  });
	                  util.clearInput();
	                  data.msg = text;
	                  return util.showSystemMsg(data);
	                });
	              }
	            });
	          case "changeNoTalk":
	            return base.baseState.set("notalk", attr);
	          case 'whiteListGet':
	            return base.baseState.get("white_list");
	          case 'whiteListSet':
	            code.set("white_list", attr);
	            text = "白名单被重置";
	            return code.save({
	              success: function() {
	                return base.baseState.get('room').send({
	                  text: text,
	                  attr: {
	                    msgLevel: "system",
	                    reload: true
	                  }
	                }, {
	                  type: 'text'
	                }, function(data) {
	                  return util.refreshPage({
	                    msg: {
	                      attr: {
	                        reload: true
	                      }
	                    }
	                  });
	                });
	              }
	            });
	          case 'whiteListAdd':
	            white_list = base.baseState.get('white_list');
	            white_list = _.extend(white_list, attr);
	            code.set("white_list", white_list);
	            return code.save({
	              success: function() {
	                console.log(white_list);
	                return base.baseState.set("white_list", white_list);
	              }
	            });
	          case 'whiteListRemove':
	            white_list = base.baseState.get('white_list');
	            key = this.getKeyByValue(white_list, attr);
	            delete white_list[key];
	            code.set("white_list", white_list);
	            return code.save({
	              success: function() {
	                text = "白名单里删除了" + attr;
	                base.baseState.set("white_list", white_list);
	                return base.baseState.get('room').send({
	                  text: text,
	                  attr: {
	                    msgLevel: "system",
	                    userReload: key
	                  }
	                }, {
	                  type: 'text'
	                }, function(data) {});
	              }
	            });
	          case 'whiteListOpen':
	            code.set("white_list_open", attr);
	            if (attr) {
	              text = "开启白名单功能";
	            } else {
	              text = "关闭白名单功能";
	            }
	            return code.save({
	              success: function() {
	                return base.baseState.get('room').send({
	                  text: text,
	                  attr: {
	                    msgLevel: "system",
	                    reload: true
	                  }
	                }, {
	                  type: 'text'
	                }, function(data) {
	                  return util.refreshPage({
	                    msg: {
	                      attr: {
	                        reload: true
	                      }
	                    }
	                  });
	                });
	              }
	            });
	          case 'broadCastSet':
	            code.set("broad_cast", attr);
	            base.baseState.set("broad_cast", attr);
	            return code.save({
	              success: function() {
	                return console.log("通知更改完成");
	              }
	            });
	          case 'broadCastPush':
	            text = base.baseState.get("broad_cast");
	            util.showBroadCast({
	              msg: {
	                text: text
	              }
	            });
	            return base.baseState.get('room').send({
	              text: text,
	              attr: {
	                msgLevel: "broad_cast"
	              }
	            }, {
	              type: 'text',
	              transient: true
	            }, function(data) {});
	          case 'getOnlineMemberCount':
	            room = base.baseState.get('room');
	            return room.count(function(data) {
	              return console.log(data);
	            });
	          default:
	            return console.log("no command");
	        }
	      } else {
	        return console.log("permit denied");
	      }
	    }
	  };
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var YouYuChatBase, YouYuChatUtil, base, util;

	YouYuChatUtil = __webpack_require__(3);

	YouYuChatBase = __webpack_require__(1);

	util = new YouYuChatUtil;

	base = new YouYuChatBase;

	module.exports = function() {
	  $(document).on("visitor:started", function() {
	    return util.showInfo("正在连接有渔直播室...");
	  });
	  $(document).on("visitor:room:connected", function() {
	    var realtime, room;
	    util.showInfo("欢迎来到有渔直播课堂，您可通过下方聊天框与直播老师互动。");
	    util.showBroadCast({
	      msg: {
	        text: base.baseState.get('broad_cast')
	      }
	    });
	    room = base.baseState.get('room');
	    realtime = base.baseState.get('realtime');
	    room.join(function() {
	      return base.getLog(room);
	    });
	    room.receive(function(data) {
	      util.refreshPage(data);
	      if (util.parseMsgLevel(data) === "member") {
	        return util.showMsg(data);
	      } else if (util.parseMsgLevel(data) === "broad_cast") {
	        return util.showBroadCast(data);
	      } else {
	        return util.showSystemMsg(data);
	      }
	    });
	    realtime.on('reuse', function() {
	      return util.showInfo("正在重新连接有渔直播聊天系统");
	    });
	    realtime.on('error', function() {
	      return util.showInfo('好像有什么不对劲 请打开console 查看相关日志 ');
	    });
	    realtime.on('join', function(res) {
	      return _.each(res.m, function(m) {
	        var name;
	        name = m.split(":")[1];
	        if (name !== base.baseState.get('client_id')) {
	          name = util.parseClientIdToName(name);
	          return util.showInfo(name + '加入有渔直播间');
	        }
	      });
	    });
	    return realtime.on('kicked', function(res) {
	      return console.log(res);
	    });
	  });
	  $(document).on("visitor:pressEnter", function() {
	    return alert("你目前还未输入姓名，不可以发言");
	  });
	  $(document).on("visitor:inputSend:click", function() {
	    return util.elements().changeName.modal("show");
	  });
	  return $(document).on("visitor:confirmName:click", function() {
	    var client_id;
	    client_id = util.elements().inputNickName.val();
	    if (util.inWhiteList(client_id) || !base.baseState.get("white_list_open")) {
	      base.baseState.set('client_id', client_id);
	      if (!util.isEmptyString(client_id)) {
	        base.closeRealTime(base.baseState.get('realtime'));
	        return util.elements().changeName.modal("hide");
	      } else {
	        return alert("昵称不能为空");
	      }
	    } else {
	      return alert("你输入的昵称不在白名单中");
	    }
	  });
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var YouYuChatBase, YouYuChatUtil, base, util;

	YouYuChatUtil = __webpack_require__(3);

	YouYuChatBase = __webpack_require__(1);

	util = new YouYuChatUtil;

	base = new YouYuChatBase;

	module.exports = function() {
	  $(document).on("user:started", function() {
	    util.elements().sendMsgBtn.attr("disabled", false);
	    return console.log("user:started");
	  });
	  $(document).on("user:room:connected", function() {
	    var realtime, room;
	    room = base.baseState.get('room');
	    realtime = base.baseState.get('realtime');
	    room.join(function() {
	      return util.showInfo("你的昵称为<span class='green'>" + (util.parseClientIdToName(base.baseState.get('client_id'))) + "</span>,已经可以发言了");
	    });
	    room.receive(function(data) {
	      util.refreshPage(data);
	      if (util.parseMsgLevel(data) === "member") {
	        return util.showMsg(data);
	      } else if (util.parseMsgLevel(data) === "broad_cast") {
	        return util.showBroadCast(data);
	      } else {
	        return util.getCheatCode().then(function() {
	          return util.showSystemMsg(data);
	        });
	      }
	    });
	    realtime.on('reuse', function() {
	      return util.showInfo("正在重新连接有渔直播聊天系统");
	    });
	    realtime.on('error', function() {
	      return util.showInfo('好像有什么不对劲 请打开console 查看相关日志 ');
	    });
	    realtime.on('kicked', function(res) {
	      return console.log(res);
	    });
	    return realtime.on('join', function(res) {
	      return _.each(res.m, function(m) {
	        var name;
	        name = m.split(":")[1];
	        if (name !== base.baseState.get('client_id')) {
	          name = util.parseClientIdToName(name);
	          return util.showInfo(name + '加入有渔直播间');
	        }
	      });
	    });
	  });
	  $(document).on("user:pressEnter", function() {
	    var msg, room;
	    msg = util.elements().inputSend.val();
	    room = base.baseState.get('room');
	    if (base.baseState.get('notalk')) {
	      alert("目前是禁止发言状态");
	    } else {
	      if (!util.isEmptyString(msg)) {
	        return room.send({
	          text: msg,
	          attr: {
	            msgLevel: "member"
	          }
	        }, {
	          type: 'text'
	        }, function(data) {
	          util.clearInput();
	          return util.showMyMsg(data, msg);
	        });
	      } else {
	        alert("请输入点文字");
	      }
	    }
	  });
	  $(document).on("user:inputSend:click", function() {});
	  return $(document).on("visitor:realtime:closed", function() {
	    console.log("vistor realtime closed");
	    return $(document).trigger("started");
	  });
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var YouYuChatBase, YouYuChatCheatCode, YouYuChatUtil, base, cheat_code, registerEvent, userAccess, util, visitorAccess;

	YouYuChatBase = __webpack_require__(1);

	YouYuChatUtil = __webpack_require__(3);

	YouYuChatCheatCode = __webpack_require__(4);

	__webpack_require__(8);

	visitorAccess = __webpack_require__(5);

	userAccess = __webpack_require__(6);

	base = new YouYuChatBase;

	util = new YouYuChatUtil;

	cheat_code = new YouYuChatCheatCode;

	registerEvent = function() {
	  util.elements().chatArea.on('keydown', function(e) {
	    if (e.keyCode === 13) {
	      return $(document).trigger("pressEnter");
	    }
	  });
	  util.elements().modalDialog.on('keydown', function(e) {
	    if (e.keyCode === 13) {
	      return $(document).trigger("visitor:confirmName:click");
	    }
	  });
	  util.elements().sendMsgBtn.on('click', function(e) {
	    return $(document).trigger("sendMsgBtn:click");
	  });
	  util.elements().inputSend.on('click', function(e) {
	    return $(document).trigger("inputSend:click");
	  });
	  return util.elements().confirmName.on('click', function(e) {
	    return $(document).trigger("confirmName:click");
	  });
	};

	$(document).on("started", function() {
	  base.getConversation();
	  console.log("started");
	  if (util.isVisitor()) {
	    registerEvent();
	    $(document).trigger("visitor:started");
	  } else {
	    $(document).trigger("user:started");
	  }
	  return cheat_code.getCheatCode().then(function() {
	    var auth_code;
	    auth_code = window.location.hash;
	    if (md5(auth_code.slice("1")) !== base.baseState.get("auth_code")) {
	      window.location.href = "/forbidden";
	    }
	  });
	});

	$(document).on("conversation_id:Got", function() {
	  console.log("conversation_id got");
	  base.connectRoom();
	  return base.currentClient.realtime.on("error", function() {
	    return console.log("error");
	  });
	});

	$(document).on("room:connected", function() {
	  console.log("room connected");
	  if (util.isVisitor()) {
	    return $(document).trigger("visitor:room:connected");
	  } else {
	    return $(document).trigger("user:room:connected");
	  }
	});

	$(document).on("room:created", function() {
	  return console.log("room created");
	});

	$(document).on("realtime:closed", function() {
	  console.log("realtime closed");
	  if (!util.isVisitor()) {
	    return $(document).trigger("visitor:realtime:closed");
	  } else {
	    return $(document).trigger("user:realtime:closed");
	  }
	});

	$(document).on("log:got", function() {
	  util.showChatLog();
	  return console.log("log got");
	});

	$(document).on("pressEnter", function() {
	  console.log("press enter");
	  if (util.isVisitor()) {
	    return $(document).trigger("visitor:pressEnter");
	  } else {
	    return $(document).trigger("user:pressEnter");
	  }
	});

	$(document).on("sendMsgBtn:click", function() {
	  console.log("click sendMsgBtn");
	  return $(document).trigger("pressEnter");
	});

	$(document).on("inputSend:click", function() {
	  console.log("click inputSend");
	  if (util.isVisitor()) {
	    return $(document).trigger("visitor:inputSend:click");
	  }
	});

	$(document).on("confirmName:click", function() {
	  console.log("click conrfirmName");
	  if (util.isVisitor()) {
	    return $(document).trigger("visitor:confirmName:click");
	  }
	});

	visitorAccess();

	userAccess();


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var YouYuChatCheatCode, cheat_code;

	YouYuChatCheatCode = __webpack_require__(4);

	cheat_code = new YouYuChatCheatCode;

	module.exports = (function() {
	  window.talklocal = function(token) {
	    return cheat_code.setCheatCode("changeNoTalk", false, token);
	  };
	  window.talkon = function(token) {
	    return cheat_code.setCheatCode("shutup", false, token);
	  };
	  window.talkoff = function(token) {
	    return cheat_code.setCheatCode("shutup", true, token);
	  };
	  window.tokenchange = function(oldtoken, newtoken) {
	    return cheat_code.setCheatCode("changeToken", newtoken, oldtoken);
	  };
	  window.authcode = function(token, auth_code) {
	    return cheat_code.setCheatCode("changeAuthCode", auth_code, token);
	  };
	  window.listget = function(token) {
	    return cheat_code.setCheatCode("whiteListGet", "", token);
	  };
	  window.listset = function(token, white_list) {
	    return cheat_code.setCheatCode("whiteListSet", white_list, token);
	  };
	  window.listpush = function(token, white_list) {
	    return cheat_code.setCheatCode("whiteListAdd", white_list, token);
	  };
	  window.listpop = function(token, value) {
	    return cheat_code.setCheatCode("whiteListRemove", value, token);
	  };
	  window.liston = function(token) {
	    return cheat_code.setCheatCode("whiteListOpen", true, token);
	  };
	  window.listoff = function(token) {
	    return cheat_code.setCheatCode("whiteListOpen", false, token);
	  };
	  window.castset = function(token, msg) {
	    return cheat_code.setCheatCode("broadCastSet", msg, token);
	  };
	  window.castpush = function(token, msg) {
	    return cheat_code.setCheatCode("broadCastPush", "", token);
	  };
	  return window.onlineCount = function(token) {
	    return cheat_code.setCheatCode("getOnlineMemberCount", "", token);
	  };
	})();


/***/ }
/******/ ]);