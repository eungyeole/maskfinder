let markers = [];
var mapContainer = document.getElementById('map'); // 지도를 표시할 div
mapContainer.style.display = "block";
var coords = new kakao.maps.LatLng(37.537187, 127.005476); //기본 위치
var mapOption = {
    center: coords, // 지도의 중심좌표
    level: 5 // 지도의 확대 레벨
};
var marker = new kakao.maps.Marker({
    position: coords, 
    map: map
});
var map = new kakao.maps.Map(mapContainer, mapOption);
map.setCenter(coords);
marker.setPosition(coords);
console.log(coords,coords.longitude,coords.latitude);
load(coords.getLng(),coords.getLat());
var clusterer = new kakao.maps.MarkerClusterer({ //병렬 클래스 찾아서 갖다 씁니다. 헿.
    map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
    minLevel: 10 // 클러스터 할 최소 지도 레벨
});
function load(lng,lat){ //이거 도배해서 그냥 묶어둠 깔끔해짐
$.ajax({
    method: "GET",
    url: "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json",
    data: {lng: lng, lat: lat, m: 2000},
})
.done(function (msg) {
    var position = msg.stores.map((item) => {
        item["latlng"] = new kakao.maps.LatLng(item.lat,item.lng); //latlng 추가만 함. 재설정을 귀찮아서 뭐하러 함.
        return item;
    });
	console.log(position);
	position = position.filter( x=> {return x.remain_stat? true:false});
	position = position.sort(function(a, b){return b.remain_stat.length - a.remain_stat.length});
	console.log(position)
    markers = []; //마커 초기화
    $('#all').empty(); //리스크 초기화
    if(!position.find((fs)=>{
        return fs.remain_stat&&fs.remain_stat != "empty"&&fs.remain_stat != "break";
    })){
        $("#all").append('<p id="mno">주변에 마스크 보유 판매처가 없습니다.</p>');
    }
    for(const i in position) { //for 문 많이 돌려도 안좋음. 이거 1개만
        var name = position[i].name;
        var lat = position[i].latlng.getLat();
        var lng = position[i].latlng.getLng();
        var address = position[i].addr.split('(');
        var stock = position[i].stock_at;
        switch(position[i].remain_stat){ //switch문이 더 편함 if 마구하는 거보다.
            case "plenty":
            var imageSrc = "https://arcspace.kr/project/maskfinder/mask/100p.png";
            //병합
            $("#all").append('<div id="mcard"><h1 id="mname" style="font-family: \'Do Hyeon\', sans-serif;">' + name + '<h1 id="mstat-p">100+</h1>' +'</h1><p id="mtext">' + address[0] + '</p><p id="mtext">' + stock + '</p><div id="mbt" OnClick="window.open(\'https://map.kakao.com/link/map/' + name + "," + lat + "," + lng + '\')"><img src="https://arcspace.kr/project/maskfinder/mask/map.png" style="width:20px; height:20px; padding-top:2px; padding-left:22px;"/><p id="mbtp" style="font-family: \'Stylish\', sans-serif;">지도에서 보기</p></div><br/>');
            break;
            case "some":
            var imageSrc = "https://arcspace.kr/project/maskfinder/mask/30p.png"; 
            $("#all").append('<div id="mcard"><h1 id="mname" style="font-family: \'Do Hyeon\', sans-serif;">' + name + '<h1 id="mstat-s">30~100</h1>' +'</h1><p id="mtext">' + address[0] + '</p><p id="mtext">' + stock + '</p><div id="mbt" OnClick="window.open(\'https://map.kakao.com/link/map/' + name + "," + lat + "," + lng + '\')"><img src="https://arcspace.kr/project/maskfinder/mask/map.png" style="width:20px; height:20px; padding-top:2px; padding-left:22px;"/><p id="mbtp" style="font-family: \'Stylish\', sans-serif;">지도에서 보기</p></div><br/>');
            break;
            case "few":
                var imageSrc = "https://arcspace.kr/project/maskfinder/mask/2p.png"; 
                $("#all").append('<div id="mcard"><h1 id="mname" style="font-family: \'Do Hyeon\', sans-serif;">' + name + '<h1 id="mstat-f">1~30</h1>' +'</h1><p id="mtext">' + address[0] + '</p><p id="mtext">' + stock + '</p><div id="mbt" OnClick="window.open(\'https://map.kakao.com/link/map/' + name + "," + lat + "," + lng + '\')"><img src="https://arcspace.kr/project/maskfinder/mask/map.png" style="width:20px; height:20px; padding-top:2px; padding-left:22px;"/><p id="mbtp" style="font-family: \'Stylish\', sans-serif;">지도에서 보기</p></div><br/>');
            break;
            case "empty":case "break":
                var imageSrc = "https://arcspace.kr/project/maskfinder/mask/p.png"; break;
            default:
                var imageSrc = "https://arcspace.kr/project/maskfinder/mask/p.png"; break;
        }
        var imageSize = new kakao.maps.Size(24, 35); 
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
        var marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: position[i].latlng, // 마커를 표시할 위치
        title : position[i].name, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image : markerImage, // 마커 이미지
        text: position[i].name
        });
        kakao.maps.event.addListener(marker, 'click', function() { //이건 거의 안만진거 같애
			$('.maskname').empty();
            $('.maskco').empty();
            $('#mmodal').show();
            $(".maskname").append(position[i].name);
            switch(position[i].remain_stat){
                case "plenty":
                    var status = "100+";
                    $(".maskco").append('<div class="masktitle-p">'+status+'</div>');
                break;
                case "some":
                    var status = "30~100";
                    $(".maskco").append('<div class="masktitle-s">'+status+'</div>');
                 break;
                case "few":
                    var status = "1~30";
                    $(".maskco").append('<div class="masktitle-f">'+status+'</div>');
                    break;
                case "empty":case "break":
                    var status = "품절";
                    $(".maskco").append('<div class="masktitle-soldout">'+status+'</div>'); break;
                default:
                    var status = "알 수 없음";
                    $(".maskco").append('<div class="masktitle-soldout">'+status+'</div>'); break;
            }
            $(".maskco").append('<div class=masktext>입고 일자 : ' + position[i].created_at + '</div>');
            $(".maskco").append('<div class=masktext>갱신 일자 : ' + position[i].stock_at + '</div>');
            $('.maskbt').removeAttr('onclick');
            var name = position[i].name;
            var lat = position[i].latlng.getLat();
            var lng = position[i].latlng.getLng();
            $('.maskbt').attr('onClick',`gomap('${name}',${lat},${lng})`); //바로 가기 버튼 고침
        });
        markers.push(marker); //새로운 마커 ㅎㅇ
    }
    clusterer.clear(); //마커 모두 제거
    clusterer.addMarkers(markers); //클러스터 array로 보내버림.
});
}  
// Geolocation API에 액세스할 수 있는지를 확인
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
        var coords = new kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        // 지도를 보여준다.
        map.relayout();
        // 지도 중심을 변경한다.
        map.setCenter(coords);
        marker.setPosition(coords);
        load(pos.coords.longitude,pos.coords.latitude);
    });
}else{
    alert("이 브라우저에서는 위치 기능을 지원하지 않으므로\n기본 위치로 설정합니다.");
}

kakao.maps.event.addListener(map, 'zoom_changed', function() {        
    // 지도의 현재 레벨을 얻어옵니다
    var level = map.getLevel();
    if(level >6)console.log("좀 더 가까이 해주세요.");
});
kakao.maps.event.addListener(map, 'center_changed', _.debounce(function() {
    if(map.getLevel() > 6){clusterer.clear();$('.sizeup').show(); $('#all').empty(); $("#all").append('<p id="mno">지도를 확대해주세요.</p>'); return;}
	$('.sizeup').hide();
	var result = map.getCenter(); //첫번째 결과의 값을 활용
	// 해당 주소에 대한 좌표를 받아서
	var coords = new kakao.maps.LatLng(result.getLat(), result.getLng());
	// 지도 중심을 변경한다.
	map.setCenter(coords);
	// 마커를 결과값으로 받은 위치로 옮긴다.
    marker.setPosition(coords);
    load(result.getLng(),result.getLat());
}),100);
function gomap(n,lat,lng){
    window.open("https://map.kakao.com/link/map/" + n + "," + lat + "," + lng);
}
var geocoder = new kakao.maps.services.Geocoder();
function sample5_execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            var addr = data.address; // 최종 주소 변수
    
            // 주소 정보를 해당 필드에 넣는다.
            document.getElementById("sample5_address").value = addr;
            // 주소로 상세 정보를 검색
            geocoder.addressSearch(data.address, function(results, status) {
                // 정상적으로 검색이 완료됐으면
                if (status === kakao.maps.services.Status.OK) {
    
                    var result = results[0]; //첫번째 결과의 값을 활용
    
                    // 해당 주소에 대한 좌표를 받아서
                    var coords = new kakao.maps.LatLng(result.y, result.x);
                    // 지도를 보여준다.
                    mapContainer.style.display = "block";
                    map.relayout();
                    // 지도 중심을 변경한다.
                    map.setCenter(coords);
                    // 마커를 결과값으로 받은 위치로 옮긴다.
                    marker.setPosition(coords);
                    load(coords.getLng(),coords.getLat());
                }
            });
        }
    }).open();
    }