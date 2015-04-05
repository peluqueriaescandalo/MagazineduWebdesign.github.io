/*global postCount:false */
/*global callback:false */
/*jshint -W020 */
$(function() {
  $('.infinite-spinner').css('display', 'none');
  var postURLs,
      isFetchingPosts = false,
      shouldFetchPosts = true,
      postsToLoad = $('body').find('.js-postcount').length,
      loadNewPostsThreshold = 200;
  
  // Load the JSON file containing all URLs
    var urlJson;
      switch($('body').find('.current-page').attr('data-page')) {
        
        // categories
        case 'ux':
          urlJson = '/articles-cat_ux.json';
        break;

        case 'wordpress':
          urlJson = '/articles-cat_wordpress.json';
        break;

        // tags
        case 'html5':
          urlJson = '/articles-tag_html5.json';
        break;

        // videos
        case 'videos':
          urlJson = '/articles-videos.json';
        break;

        // divers
        case 'collections':
          urlJson = '/collections.json';
        break;

        case 'encyclos':
          urlJson = '/encyclos.json';
        break;

        case 'briefs':
          urlJson = '/briefs.json';
        break;

        default: urlJson = '';

    }


    $.getJSON(urlJson, function(data) {
      postURLs = data.posts;
      // If there aren't any more posts available to load than already visible, disable fetching
      if (postURLs.length <= postsToLoad)
        disableFetching();
    });
  
  // If there's no spinner, it's not a page where posts should be fetched
  if ($('.infinite-spinner').length < 1)
    shouldFetchPosts = false;
  
  // Are we close to the end of the page? If we are, load more posts
  $(window).scroll(function(e){
    if (!shouldFetchPosts || isFetchingPosts) return;
    var windowHeight = $(window).height(),
        windowScrollPosition = $(window).scrollTop(),
        bottomScrollPosition = windowHeight + windowScrollPosition,
        documentHeight = $(document).height();
    
    // If we've scrolled past the loadNewPostsThreshold, fetch posts
    if ((documentHeight - loadNewPostsThreshold) < bottomScrollPosition) {
        fetchPosts();
    }
  });

 
  // Fetch a chunk of posts
  function fetchPosts() {
    // Exit if postURLs haven't been loaded
    if (!postURLs) return;

    isFetchingPosts = true;
    $('.infinite-spinner').css('display', 'block');
    // Load as many posts as there were present on the page when it loaded
    // After successfully loading a post, load the next one
    var loadedPosts = 0;

        postCount = $('body').find('.js-postcount').length,
        callback = function() {
          loadedPosts++;
          var postIndex = postCount + loadedPosts;
          
          if (postIndex > postURLs.length-1) {
            disableFetching();
            $('.infinite-spinner').css('display', 'none');
            return;
          }

          if (loadedPosts < postsToLoad) {
            fetchPostWithIndex(postIndex, callback);
          } else {
            isFetchingPosts = false;
            $('.infinite-spinner').css('display', 'none');
          }
        };
    
    fetchPostWithIndex(postCount + loadedPosts, callback);
  }
  var dateClean = '';
  function fetchPostWithIndex(index, callback) {
    
    var postURL = postURLs[index];
    $.get(postURL, function(data) {
      var poststructure;
      var strHeader = '';
      var str = '';
      switch($('body').find('.current-page').attr('data-page')) {
        
        // categories
        case 'ux':
          str+='<a href="'+postURL+'" title="'+$(data).find('.headline-post').html()+'"><article class="carte-article-secondaire js-postcount" itemprop="blogPosts" itemscope itemtype="http://schema.org/BlogPosting"><div class="row collapse">';
          str+='<div class="small-9 columns"><h1 class="carte-article-secondaire-post-title" itemprop="headline">'+$(data).find('.headline-post').html()+'</h1></div>';
          str+='<div class="small-3 columns"><img class="right" src="'+$(data).find('.is-img').attr('data-is-img')+'" title="'+$(data).find('.headline-post').html()+'"/></div></div></article></a>';
          $('.section-carte-index-panel').append(str);
          break;

        case 'wordpress':
          str+='<a href="'+postURL+'" title="'+$(data).find('.headline-post').html()+'">';
          str+='<article class="carte-article-secondaire js-postcount" itemprop="blogPosts" itemscope itemtype="http://schema.org/BlogPosting"><div class="row collapse"><div class="small-9 columns"><h1 class="carte-article-secondaire-post-title" itemprop="headline">'+$(data).find('.headline-post').html()+'</h1></div>';
          str+='<div class="small-3 columns"><img class="right" src="'+$(data).find('.is-img').attr('data-is-img')+'" title="'+$(data).find('.headline-post').html()+'"/></div></div></article></a>';
          $('.section-carte-index-panel').append(str);
          break;

        // tags
        case 'html5':
          str+='<a href="'+postURL+'" title="'+$(data).find('.headline-post').html()+'">';
          str+='<article class="carte-article-secondaire js-postcount" itemprop="blogPosts" itemscope itemtype="http://schema.org/BlogPosting"><div class="row collapse"><div class="small-9 columns"><h1 class="carte-article-secondaire-post-title" itemprop="headline">'+$(data).find('.headline-post').html()+'</h1></div>';
          str+='<div class="small-3 columns"><img class="right" src="'+$(data).find('.is-img').attr('data-is-img')+'" title="'+$(data).find('.headline-post').html()+'"/></div></div></article></a>';
          $('.section-carte-index-panel').append(str);
          break;

        // videos
        case 'videos':
          str+='<li>';
          str+='<article class="videos-index-video-item js-postcount" itemscope="" itemtype="http://schema.org/Article"><div class="row"><div class="small-12 columns">';
          // video-thumbnail
          str+='<div class="videos-index-video-thumbnail" style="background-image: url('+$(data).find('.figure-video').attr('data-is-video')+');">';
          str+='<a href="'+postURL+'" title="'+$(data).find('.header-liste-headline').html()+'">';
          str+='<div class="gradient-shadow-img">';
          str+='<svg class="gradient-shadow-img-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M16 10v28l22-14z" fill="#FFFFFF"/></svg>';
          str+='</div></a></div></div></div>';
          // video-title
          str+='<a href="'+postURL+'" title="'+$(data).find('.header-liste-headline').html()+'">';
          str+='<div class="carte-article-secondaire mod-index-videos row collapse"><div class="small-12 columns">';
          str+='<h1 class="carte-article-secondaire-post-title mod-small-title" itemprop="headline">'+$(data).find('.header-liste-headline').html()+'</h1>';
          str+='</div></div></a></article></li>';
          $('.videos-index-container').append(str);
          break;

        // divers
        case 'encyclos':
          str+='<a href="'+postURL+'" title="'+$(data).find('.encyclo-title-def').html()+'">';
          str+='<article class="carte-article-secondaire js-postcount" itemprop="blogPosts" itemscope itemtype="http://schema.org/BlogPosting"><div class="row collapse"><div class="small-9 columns"><h1 class="carte-article-secondaire-post-title" itemprop="headline">'+$(data).find('.headline-post').html()+'</h1></div>';
          str+='<div class="small-3 columns"><img class="right" src="'+$(data).find('.is-img').attr('data-is-img')+'" title="'+$(data).find('.encyclo-title-def').html()+'"/></div></div></article></a>';
          $('.section-carte-index-panel').append(str);
          break;
          
        case 'collections':
          str+='<a href="'+postURL+'" title="'+$(data).find('.headline-collection').html()+'">';
          str+='<article class="collection-index-article js-postcount" itemprop="blogPosts" itemscope itemtype="http://schema.org/BlogPosting" style="background-image: url('+$(data).find('.is-img').attr('data-is-img')+');"><div class="shadow-img"><div class="collection-index-article-content">';
          str+='<h1 class="text-center" itemprop="headline">'+$(data).find('.headline-collection').html()+'</h1>';
          str+='<p class="text-center">'+$(data).find('.header-liste-content').html()+'</p></div></div></article></a>';
          $('.collection-index-panel').append(str);
          break;

        case 'briefs':
          if(dateClean !== $(data).find('.section-brief-header').attr('data-cleaned')) {
            if(dateClean !== '') str+='</div></div></section>';
            strHeader = '';
            strHeader+='<section><header class="row-liste-index">';
            strHeader+='<time class="small-12 columns section-brief-header"><h1 class="section-brief-header-titre">'+$(data).find('.section-brief-header').attr('data-week-day')+'<span class="section-brief-header-baseline">'+$(data).find('.section-brief-header-baseline').html()+'</span></h1></time>';
            strHeader+='</header><div class="row-liste-index"><div class="small-12 columns section-brief-panel date-'+$(data).find('.section-brief-header').attr('data-cleaned')+'"></div></div></section>';
            $('.note-index').append(strHeader);
          }

          // item note
          // ----------------------------------
          if(dateClean !== $(data).find('.section-brief-header').attr('data-cleaned')) {
          str='<article class="js-postcount note note-first"><div class="row collapse"><div class="small-12 columns">';
          } else {
            str='<article class="js-postcount note"><div class="row collapse"><div class="small-12 columns">';
          }
          str+= $(data).find('.section-brief-panel').html();
          $('.date-'+$(data).find('.section-brief-header').attr('data-cleaned')).append(str);

          dateClean = $(data).find('.section-brief-header').attr('data-cleaned');
          
          break;

        default: $('.section-carte-index-panel').append('<h1>'+$(data).find('.headline-post').html()+'</h1>');
      }
      $(poststructure);
      callback();
    });
  }
  
  function disableFetching() {
    shouldFetchPosts = false;
    isFetchingPosts = false;
    $('.infinite-spinner').fadeOut();
  }
  
});