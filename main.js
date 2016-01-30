
var Post = Backbone.Model.extend({
	
});

var PostCollection = Backbone.Firebase.Collection.extend({
	model: Post,
	url: "https://blogenginedb.firebaseio.com"
});

var PostView = Backbone.View.extend({
	tagName:"div",
	template: _.template(
					`<div class='title'><%= title %></div>
					<div class='post'><%= body %></div> `),
	initialize: function(){
		this.listenTo(this.model,"change",this.render);
	},
	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
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
    this.inputBody = this.$("#new-post-body");
    this.listenTo(this.collection, 'add', this.addOne);
  },
  addOne: function(post) {
    var view = new PostView({model: post});
    this.list.append(view.render().el);
  },
  createPost: function(e) {
	console.log('creating post');
    if (!this.inputTitle.val() && !this.inputBody.val()) { return; }
    this.collection.create({title: this.inputTitle.val(),
							body: this.inputBody.val()});
    this.inputTitle.val('');
    this.inputBody.val('');
  }
});

function init() {
  var collection = new PostCollection();
  var app = new AppView({ collection: collection });
}
$(function() {
  init();
});
