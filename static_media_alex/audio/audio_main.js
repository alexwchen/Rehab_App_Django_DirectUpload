$(document).ready(function () {





    $("#formsubmit").click(function () {

        var iframe = $('<iframe name="postiframe" id="postiframe" style="display: block" />');

        $("body").append(iframe);


        var form = $('#theuploadform');
        form.attr("action", "/portal/");
        form.attr("method", "post");
        form.attr("enctype", "multipart/form-data");
        form.attr("encoding", "multipart/form-data");
        form.attr("target", "postiframe");
        form.attr("file", $('#userfile').val());
        form.submit();

        $("#postiframe").load(function () {
            iframeContents = $("#postiframe")[0].contentWindow.document.body.innerHTML;
            $("#textarea").html(iframeContents);
        });

        return false;

    });

});


function __fire(e, data) {    
  log.innerHTML += "\n" + e + " " + (data || '');
}

var audio_context;
var recorder;

function iCanHazUserMedia(stream) {
  __fire('I haz live stream');
  var input = audio_context.createMediaStreamSource(stream);
  input.connect(audio_context.destination);
  __fire('input connected to destination');
  recorder = new Recorder(input);
  __fire('recorder init\'d');
}

function startRecording(me) {
  recorder && recorder.record();
  me.disabled = true;
  me.nextSibling.disabled = false;
  __fire('recording....');
}


function stopRecording(me) {
  recorder && recorder.stop();
  me.disabled = true;
  me.previousSibling.disabled = false;
  __fire('nuff recording');
  
  recorder && recorder.exportWAV(function(blob) {
    var url = URL.createObjectURL(blob);
    var li = document.createElement('li');
    var au = document.createElement('audio');
    var hf = document.createElement('a');
    au.controls = true;
    au.src = url;
    hf.href = url;
    hf.download = new Date().toISOString() + '.wav';
    hf.innerHTML = hf.download;
    li.appendChild(au);
    li.appendChild(hf);
    recordingslist.appendChild(li);

	// File Upload Code Starts Here
	jQuery(document).ajaxSend(function(event, xhr, settings) {
	    function getCookie(name) {
	        var cookieValue = null;
	        if (document.cookie && document.cookie != '') {
	            var cookies = document.cookie.split(';');
	            for (var i = 0; i < cookies.length; i++) {
	                var cookie = jQuery.trim(cookies[i]);
	                // Does this cookie string begin with the name we want?
	                if (cookie.substring(0, name.length + 1) == (name + '=')) {
	                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
	                    break;
	                }
	            }
	        }
	        return cookieValue;
	    }
	    function sameOrigin(url) {
	        // url could be relative or scheme relative or absolute
	        var host = document.location.host; // host + port
	        var protocol = document.location.protocol;
	        var sr_origin = '//' + host;
	        var origin = protocol + sr_origin;
	        // Allow absolute or scheme relative URLs to same origin
	        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
	            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
	            // or any other URL that isn't scheme relative or absolute i.e relative.
	            !(/^(\/\/|http:|https:).*/.test(url));
	    }
	    function safeMethod(method) {
	        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	    }

	    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
	        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
	    }
	});
	
	
	// INSTANT FILE UPLOAD SOLVED
	//***********************************************************
	//***********************************************************
	//***********************************************************
	//***********************************************************
	
	var token = $('meta[name="csrf-token"]').attr('content');
	if (token) xhr.setRequestHeader('X-CSRF-Token', token);
	var fd = new FormData();
	var fuck = blob;
	fd.append('fname', hf.download);
	fd.append('data', fuck);
	$.ajax({
	    type: 'POST',
	    url: '/portal/file_upload_handler',
	    data: fd,
	    processData: false,
	    contentType: false
	}).done(function(data) {
	       console.log(data);
	});
	
	alert('audio_main.js: this audio is being saved!!!!!!!!');
	alert('file name is currently: static_media_alex/document/blob, should solve this later');
	//***********************************************************
	//***********************************************************
	//***********************************************************
	//***********************************************************
	
  });
  
  recorder.clear(); 
}


onload = function init(){
  try {
    // shim      
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL
    
    audio_context = new AudioContext;
    __fire('Audio context OK');
    __fire('navigator.getUserMedia ' + (navigator.getUserMedia ? 'OK' : 'fail'));
  } catch (e) {
    alert('No web audio support in this browser');
  }
  
  navigator.getUserMedia(
    {audio:true},
    iCanHazUserMedia, 
    function(e){__fire('No live audio input ' + e);}
  );
  
};