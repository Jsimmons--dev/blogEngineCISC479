
var Post = Backbone.Model.extend({
	
});

var PostCollection = Backbone.Firebase.Collection.extend({
	model: Post,
	url: "https://blogenginedb.firebaseio.com"
});

var PostView = Backbone.View.extend({
	tagName:"div",
	template: _.template(
					`<div class='panel-item title'><%= title %></div>
					<div class='panel-item'><%= desc %></div> 
					<div class='panel-item'><%= body %></div> 
					`),
	initialize: function(){
		this.listenTo(this.model,"change",this.render);
	},
	render: function(){
		this.$el.html('<div class="panel">'+this.template(this.model.toJSON())+'</div>');
		return this;
	}
});

var AppView = Backbone.View.extend({
  el: $('#blogapp'),
  events: {
    "click #add-post" : "createPost",
  },
  initialize: function() {
    this.list = this.$("#blog-list");
	this.inputTitle = this.$("#new-post-title");
    this.inputDesc = this.$("#new-post-desc");
    this.inputBody = this.$("#new-post-body");
    this.listenTo(this.collection, 'add', this.addOne);
  },
  addOne: function(post) {
    var view = new PostView({model: post});
    this.list.append(view.render().el);
  },
  createPost: function(e) {
	console.log('creating post');
    if (!this.inputTitle.val() || !this.inputBody.val() || !this.inputDesc.val()) { console.log('post was empty!'); return; }
    this.collection.create({title: this.inputTitle.val(),
							desc: this.inputDesc.val(),
							body: this.inputBody.val()
							});
    this.inputTitle.val('');
    this.inputDesc.val('');
    this.inputBody.val('');
	showNewPost();
  }
});

function init() {
  var collection = new PostCollection();
  var app = new AppView({ collection: collection });
}
$(function() {
  init();
});

var hideButton = '<span class="mega-octicon octicon-diff-removed"></span>';
var showButton = '<span class="mega-octicon octicon-diff-added"></span>';
function showNewPost(){
	var newPost = $('#new-post');
	var newPostButton = $('#new-post-button');
	if(newPostButton.hasClass('add')){
		newPost[0].style.display = 'block';	
		newPostButton.removeClass('add');
		newPostButton.html(hideButton);
	} else {
		newPost[0].style.display = 'none';	
		newPostButton.addClass('add');
		newPostButton.html(showButton);
	}
}
