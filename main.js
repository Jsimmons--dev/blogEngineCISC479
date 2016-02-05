var Post = Backbone.Model.extend({

});

var PostCollection = Backbone.Firebase.Collection.extend({
    model: Post,
    url: "https://blogenginedb.firebaseio.com"
});

var newButton = _.template(`
				<div onclick='<%= click %>'>
					<span class='mega-octicon octicon-<%= icon %>'></span>
				</div>
				`);

var modal = _.template(
    `<div id='experimentModal' class="darken fullscreen">
						<div id="new-post-pane" class="solid rounded bg-white">
							${newButton({click:'hideExperimentModal()',icon:'x'})}
							${newButton({click:'rotateStyles()',icon:'flame'})}
							<input type="text" class="margin-med" id="new-post-title"
							 placeholder="New Title"></input>
							<input type="text" class="margin-med" id="new-post-desc"
						   	placeholder="New Description"></input>
							<textarea class="margin-med" rows=10 type="type" id="new-post-body" 
							placeholder="New Body"></textarea>
							<button class="margin-med" id="add-post-button">Add</button>
						</div>	
					</div>`);

function hideExperimentModal() {
    $('#experimentModal')
        .remove();
    $('#new-style-button')
        .html(newButton({
            click: 'onclick=showExperimentModal()',
            icon: 'beaker'
        }));
}

function showExperimentModal() {
    $('#blogapp')
        .prepend(modal({}));
    $('#new-style-button')
        .html('');
}

var PostView = Backbone.View.extend({
    tagName: "div",
    id: "blog-post",
    template: _.template(
        `<div><%= title %></div>
					<div><%= desc %></div> 
					<div><%= body %></div> 
					`),
    initialize: function () {
        this.listenTo(this.model, "change", this.render);
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var AppView = Backbone.View.extend({
    el: $('#blogapp'),
    events: {
        "click #add-post-button": "createPost"
    },
    initialize: function () {
        this.list = this.$("#blog-list");
        this.inputTitle = this.$("#new-post-title");
        this.inputDesc = this.$("#new-post-desc");
        this.inputBody = this.$("#new-post-body");
        this.listenTo(this.collection, 'add', this.addOne);
    },
    addOne: function (post) {
        var view = new PostView({
            model: post
        });
        this.list.append(view.render()
            .el);
    },
    createPost: function (e) {
        this.inputTitle = this.$("#new-post-title");
        this.inputDesc = this.$("#new-post-desc");
        this.inputBody = this.$("#new-post-body");
        console.log('creating post');
        if (!this.inputTitle.val() || !this.inputBody.val() || !this.inputDesc.val()) {
            console.log('post was empty!');
            return;
        }
        this.collection.create({
            title: `<h1>${this.inputTitle.val()}</h1>`,
            desc: `<h3>${this.inputDesc.val()}</h3>`,
            body: this.inputBody.val()
        });
        this.inputTitle.val('');
        this.inputDesc.val('');
        this.inputBody.val('');
        //showNewPost();
    }
});

function init() {
    var collection = new PostCollection();
    var app = new AppView({
        collection: collection
    });
}
$(function () {
    init();
});

var hideButton = '<span class="mega-octicon octicon-diff-removed"></span>';
var showButton = '<span class="mega-octicon octicon-diff-added"></span>';

function showNewPost() {
    var newPost = $('#new-post-panel');
    var newPostButton = $('#new-post-button');
    if (newPostButton.hasClass('add')) {
        newPost[0].style.display = 'flex';
        newPostButton.removeClass('add');
        newPostButton.html(hideButton);
    } else {
        newPost[0].style.display = 'none';
        newPostButton.addClass('add');
        newPostButton.html(showButton);
    }
}
//-----------------------
var PacketList = function (CSSPackets) {
    var _packets = CSSPackets || [];
    this.add = function (packet) {
        _packets.push(packet);
    }

    this.getPackets = function () {
        return _packets;
    }

    this.randomStyle = function () {
        var style = [];
        _packets.forEach((d) => {
            style.push(...d.randomPair());
        });
        return style;
    }
}

var CSSPacket = function (selectors, classes) {
    this.selectors = selectors;
    this.classes = classes;
    this.randomPair = function () {
        var pairs = [];
        this.selectors.forEach((d) => {
            pairs.push([d, this.classes[Math.floor(Math.random() * this.classes.length)]])
        });
        return pairs;
    }
}

var Styler = function (packetList) {
    var packets = packetList;
    this.randomStyle = function () {
        return packetList.randomStyle();
    }
    this.changeStyle = function (style) {
        style.forEach((d) => {
            var nodes = document.querySelectorAll(d[0]);
            for (var i = 0; i < nodes.length; ++i) {
                console.log(nodes[i]);
                nodes[i].className = d[1];
            }
        });
    }
}

//var packets = new PacketList();
//packets.add(new CSSPacket(
//  ['div.preamble',
//    'div.summary',
//    'div.explanation',
//    'div.participation',
//    'div.benefits',
//    'div.requirements',
//    'div.design-selection',
//    'div.design-archives',
//    'div.zen-resources'
//  ], [
//    'lilac-peri',
//    'purple-slate'
//  ]));
function test() {
    console.log(...arguments);
}

var testPacket = new CSSPacket(['div.class1'], ['class1']);
test('should only be one pair ', testPacket.randomPair());
test('should be the same as above ', testPacket.randomPair());

var testPacket2 = new CSSPacket(['div.class2'], ['class1', 'class2', 'class3']);
test('should only be one pair ', testPacket2.randomPair());
test('could be the same or different as above ', testPacket2.randomPair());

var testPacket3 = new CSSPacket(['div.class3', 'div.class4'], ['class1']);
test('should be two pairs ', testPacket3.randomPair());
test('could be the same or different as above ', testPacket3.randomPair());

var testPackets = new PacketList();
test('packets should be empty ', testPackets.getPackets());

testPackets.add(testPacket);
test('packets should have one packet ', testPackets.getPackets());
test('random style should only include one pair ', testPackets.randomStyle());

testPackets.add(testPacket2);
test('packets should have two packets ', testPackets.getPackets());
test('random style should have two pairs ', testPackets.randomStyle());

testPackets.add(testPacket3);
test('packets should have three packets ', testPackets.getPackets());
test('random style should have four pairs ', testPackets.randomStyle());

var testStyler = new Styler(testPackets);
test('random style should have four pairs ', testStyler.randomStyle());

var packets = new PacketList();

packets.add(new CSSPacket(
['#blog-post'
], ['pink-teal padding-thin margin-thin',
'gold-cobalt padding-thin margin-thin',
'pink-teal glow-thin padding-med margin-med border-rad-med padding-thin',
'gold-cobalt glow-thin border-rad-thin margin-thick padding-thick',
'round-square margin-thick',
'stripes2 border-rad-thin padding-thick margin-med monospace',
'stripes1 border-rad-thin padding-thick margin-med monospace',
'grid border-rad-thin padding-thick margin-med handwritten'

]
));

var styler = new Styler(packets);
var randomStyle = packets.randomStyle();
test('packets should have one pair ', randomStyle);
styler.changeStyle(randomStyle);

function rotateStyles() {
    var random = styler.randomStyle();
    styler.changeStyle(random);
}
