$(function(){
    var mql = window.matchMedia("screen and (max-width: 768px)");
	var duration = 400;
	var $sidebar = $('.sidebar');
	if (mql.matches) {
		var $sidebarButton = $sidebar.find('button')
		$sidebar.toggleClass('open');
		if($sidebar.hasClass('open')){
			$sidebar.stop(true).animate({right: '-70px'}, duration, 'easeOutBack');
			$sidebarButton.find('span').text('>');
		}else{
			$sidebar.stop(true).animate({right: '-300px'}, duration, 'easeInBack');
			$sidebarButton.find('span').text('<');
		};
		var $sidebarButton = $sidebar.find('button').on('click', function(){
			$sidebar.toggleClass('open');
			if($sidebar.hasClass('open')){
				$sidebar.stop(true).animate({right: '-70px'}, duration, 'easeOutBack');
				$sidebarButton.find('span').text('>');
			}else{
				$sidebar.stop(true).animate({right: '-300px'}, duration, 'easeInBack');
				$sidebarButton.find('span').text('<');
			};
		});

	} else {
		var $sidebarButton = $sidebar.find('button')
		$sidebar.toggleClass('open');
		if($sidebar.hasClass('open')){
			$sidebar.stop(true).animate({right: '-70px'}, duration, 'easeOutBack');
			$sidebarButton.find('span').text('>');
		}else{
			$sidebar.stop(true).animate({right: '-525px'}, duration, 'easeInBack');
			$sidebarButton.find('span').text('<');
		};
		var $sidebarButton = $sidebar.find('button').on('click', function(){
			$sidebar.toggleClass('open');
			if($sidebar.hasClass('open')){
				$sidebar.stop(true).animate({right: '-70px'}, duration, 'easeOutBack');
				$sidebarButton.find('span').text('>');
			}else{
				$sidebar.stop(true).animate({right: '-525px'}, duration, 'easeInBack');
				$sidebarButton.find('span').text('<');
			};
		});

	}
});