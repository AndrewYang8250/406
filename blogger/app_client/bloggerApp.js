var app = angular.module('bloggerApp', ['ngRoute', 'ui.router']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'pages/home.html',
			controller: 'HomeController',
			controllerAs: 'vm'
		})

		.when('/blogList', {
			templateUrl: 'pages/blogList.html',
			controller: 'ListController',
			controllerAs: 'vm'
		})

		.when('/blogAdd', {
			templateUrl: 'pages/blogAdd.html',
			controller: 'AddController',
			controllerAs: 'vm'
		})

		.when('/blogEdit/:id', {
			templateUrl: 'pages/blogEdit.html',
			controller: 'EditController',
			controllerAs: 'vm'
		})

		.when('/blogDelete/:id', {
			templateUrl: 'pages/blogDelete.html',
			controller: 'DeleteController',
			controllerAs: 'vm'
		})

		.when('/register', {
			templateUrl: 'pages/register.html',
			controller: 'RegisterController',
			controllerAs: 'vm'
		})

		.when('/login', {
			templateUrl: 'pages/login.html',
			controller: 'LoginController',
			controllerAs: 'vm'
		})

		.when('/comments/add/:id', {
			templateUrl: 'pages/addComments.html',
			controller: 'CommentsController',
			controllerAs: 'vm'
		})

		.when('/comments/:id', {
			templateUrl: 'pages/commentsList.html',
			controller: 'CommentsListController',
			controllerAs: 'vm'
		})

		.otherwise({redirectTo: '/'});
});

app.config(function($stateProvider) {
	$stateProvider
		.state('blogList', {
			url: '/blogList',
			templateUrl: 'pages/blogList.html',
			controller: 'ListController'
		});
});

function getBlogs($http) {
	return $http.get('/api/blogs');
}

function getBlogById($http, id) {
	return $http.get('/api/blogs/' + id);
}

function addBlog($http, authentication, data) {
	return $http.post('/api/blogs/', data, { headers : { Authorization: 'Bearer ' + authentication.getToken() }} );
}

function updateBlog($http, authentication, id, data) {
	return $http.put('/api/blogs/' + id, data, { headers : { Authorization: 'Bearer ' + authentication.getToken() }} );
}

function deleteBlog($http, authentication, id) {
	return $http.delete('/api/blogs/' + id, { headers : { Authorization: 'Bearer ' + authentication.getToken() }} );
}

function addComment($http, authentication, id, data) {
		return $http.put('/api/blogs/' + id + '/comments', data, { headers : { Authorization: 'Bearer ' + authentication.getToken() }} );
}

app.controller('HomeController', function HomeController() {
	var vm = this;
	vm.pageHeader = {
		title: "Andrew Yang's Blog Site"
	};
	vm.message = "Welcome to my blog site!";
});

app.controller("AddController", [ '$http', '$routeParams', '$state', 'authentication', function AddController($http, $routeParams, $state, authentication) {
	var vm = this;
	vm.blog = {};
	vm.title = "Add Blog";
	vm.submit = function() {
		var data = vm.blog;
		data.title = addForm.title.value;
		data.text = addForm.text.value;
		
		var currentUser = authentication.currentUser();
		data.author = currentUser.name
		data.authorEmail = currentUser.email;
		
		addBlog($http, authentication, data)
			.success(function(data) {
				vm.message = "Blog data added!";
				$state.go('blogList');
			})
			.error(function (e) {
				vm.message = "Could not add blog";
			});
		}
}]);

app.controller('ListController', [ '$http', '$scope', '$interval', 'authentication', function ListController($http, $scope, $interval, authentication) {
	var vm = this;
		
	vm.pageHeader = {
		title: 'Blog List'
	};

	vm.isLoggedIn = authentication.isLoggedIn();
	vm.currentUser = authentication.currentUser();
	
	getBlogs($http)
		.success(function(data) {
			vm.blogs = data;
			vm.message = "Blog data found!";
		})
		.error(function (e) {
			vm.message = "Could not get list of blogs";
	});
	
	$scope.callAtInterval = function() {
		console.log("Interval occured");
		getBlogById($http)
			.success(function(data) {
				vm.blogs = data;
				vm.message = "Blog data found!";
			})
			.error(function (e) {
				vm.message = "Could not get list of blogs";
			});
	}	
	$interval( function() {$scope.callAtInterval();}, 3000, 0, true);
}]);

app.controller('EditController', [ '$http', '$routeParams', '$state', 'authentication', function EditController($http, $routeParams, $state, authentication) {
	var vm = this;
	vm.blog = {}; 
	vm.id = $routeParams.id; 
	vm.pageHeader = {
		title: 'Blog Edit'
	};

		
	getBlogById($http, vm.id).success(function(data) {
		vm.blog = data;
		vm.message = "Blog data found!";
	})
	.error(function (e) {
		vm.message = "Could not get blog with id " + vm.id;
	});
	vm.submit = function() {
		var data = vm.blog;
		data.title = userForm.title.value;
		data.text = userForm.text.value;

		updateBlog($http, authentication, vm.id, data).success(function(data) {
			vm.message = "Blog data updated!";
			$state.go('blogList');
		})
		.error(function (e) {
			vm.message = "Could not update blog with id " + vm.id;
		});
	}
}]);

app.controller("DeleteController", [ '$http', '$routeParams', '$state', 'authentication', function DeleteController($http, $routeParams, $state, authentication) {
	var vm = this;
	vm.blog = {};
	vm.id = $routeParams.id;
	vm.title = "Delete Blog";

	getBlogById($http, vm.id)
		.success(function(data) {
			vm.blog = data;
			vm.message = "Blog data found!";
		})
		.error(function (e) {
			vm.message = "Could not get blog with id " + vm.id;
		});

		vm.submit = function() {
			var data = {};
			deleteBlog($http, authentication, vm.id)
			.success(function(data) {
				vm.message = "Blog data deleted!";
				$state.go('blogList');
			})
			.error(function (e) {
				vm.message = "Could not delete blog with id " + vm.id;
			});
																}
															vm.cancel = function() {
															$state.go('blogList');
															}
}]);

app.controller("CommentsController", [ '$http', '$routeParams', '$state', 'authentication', function CommentsController($http, $routeParams, $state, authentication) {
	var vm = this;
	vm.title = "Add Comment";
	vm.blog = {};
	vm.comment = {};
	vm.id = $routeParams.id;
	vm.commentsList = new Array();

	var currentUser = authentication.currentUser();

	getBlogById($http, vm.id).success(function(data) {
		vm.blog = data;
		vm.message = "Blog data found!";
		vm.commentsList = data.comments;
	})
	
	.error(function (e) {
		vm.message = "Could not get blog with id " + vm.id;
	});
	
	vm.submit = function() {
		var data = {};
		var comment = vm.comment;
																	comment.author = currentUser.name;
		comment.authorEmail = currentUser.email;
		comment.text = userForm.comments.value;
		
		vm.commentsList.push(comment);
		data.comments = vm.commentsList;
	
		addComment($http, authentication, vm.id, data)
			.success(function(data) {
				vm.message = "Blog comments updated";
				$state.go('blogList');
			})
			.error(function(e) {
				vm.message = "Could not add comment to blog with id " + vm.id;
			});
	
	}
	
	vm.cancel = function() {
		$state.go('blogList');
	
	}
	
}]);

app.controller("CommentsListController", [ '$http', 'authentication', '$routeParams', '$scope', '$interval', function CommentsListController($http, authentication, $routeParams, $scope, $interval) {
	var vm = this;
	vm.title = "Blog Comments";
	vm.blog = {};
	vm.id = $routeParams.id;

	vm.isLoggedIn = authentication.isLoggedIn();
	getBlogById($http, vm.id).success(function(data) {
		vm.blog = data;
		vm.message = "Blog data found!";
	})
	.error(function (e) {
		vm.message = "Could not get blog with id " + vm.id;
	});
	$scope.callAtInterval = function() {
		console.log("Interval refresh occured");
		getBlogById($http, vm.id).success(function(data) {
			vm.blog = data;
			vm.message = "Blog data found!";
		})
		.error(function (e) {
			vm.message = "Could not get blog with id " + vm.id;
		});
	}
	$interval( function() {$scope.callAtInterval();}, 3000, 0, true);

}]);
