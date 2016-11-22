(function () {

    window.addEventListener('load', function () {
        createVK();
    });

    function createVK() {
        var vk = document.createElement('script');
        document.body.appendChild(vk);
        vk.onload = function () {
            initVK();
        };
        vk.src = '//vk.com/js/api/openapi.js?136';
    }

    function initVkWidgetAuth() {
    	//toggleVkWidget('.comments', false);
    	//toggleVkWidget('.auth', true);
    	//VK.init({apiId: 5250336});
    	VK.Widgets.Auth("vk_auth", {
    		width: "auto", onAuth: function (data) {
    			//alert('user ' + data['first_name'] + ' ' + data['last_name'] + ' authorized');
    			window.location.href = 'http://neurodeep.ru#social';
    			window.location.reload();
    		}
    	});
    }

    function initVkWidgetComments() {
    	//toggleVkWidget('.comments', true);
    	//toggleVkWidget('.auth', false);
    	//VK.init({apiId: 5250336, onlyWidgets: true});
    	VK.Widgets.Comments("vk_comments", {
			limit: 100,
			attach: "*",
			autoPublish: 0
    	});
    }

    // function initVkWidgetGroups() {
    // 	VK.Widgets.Subscribe("vk_groups", {mode: 2}, -113031536);
    // }

    function initVK() {
    	VK.init({apiId: 5250336, onlyWidgets: true});

    	VK.Auth.getLoginStatus(function (response) {
    		if (response.status === 'connected') {
    			initVkWidgetComments();
    		}
    		else {
    			initVkWidgetAuth();
    		}
    	});

    	// initVkWidgetGroups();
    }

    function toggleVkWidget(className, show) {
    	var comments = document.querySelector(className);
    	if (typeof show === 'undefined') {
    		show = true;
    	}
    	if (show) {
    		comments.style.display = 'block';
    	}
    	else {
    		comments.style.display = 'none';
    	}
    }

})();