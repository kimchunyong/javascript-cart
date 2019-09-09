'use strict';

/*
 * 더미 데이터 
*/
var getCartData = function () {
	return new Promise(function (resolve, reject) {
		var cartData = [
			{"img": "/public/img/edu_internet/edu_buy_video_thums_1.jpg", "text": "스트렝스 트레이닝&코디네이션(STC)베이직코스1", "price": 50000, "saleprice": 5000, "ischeck": false},
			{"img": "/public/img/edu_internet/edu_buy_video_thums_1.jpg", "text": "스트렝스 트레이닝&코디네이션(STC)베이직코스2", "price": 200000, "saleprice": 5000, "ischeck": false},
			{"img": "/public/img/edu_internet/edu_buy_video_thums_1.jpg", "text": "스트렝스 트레이닝&코디네이션(STC)베이직코스3", "price": 300000, "saleprice": 40000, "ischeck": false},
			{"img": "/public/img/edu_internet/edu_buy_video_thums_1.jpg", "text": "스트렝스 트레이닝&코디네이션(STC)베이직코스4", "price": 400000, "saleprice": 10000, "ischeck": false}
		]
		resolve(cartData);
	})
}

getCartData()
	.then(function (res) {
		var cartShop = new Cart(res, '.shop__menu-wrap', '.cart__total-info-box');
		cartShop.render();
	})


/*
 * 장바구니 구현
 */	
var Cart = function (cartData, drawParent, totalParent) {
	this.data = cartData || [];
	this.checkedNum = [];
	this.drawParent = drawParent;
	this.totalParent = totalParent;

	this.checkItems = function () {
		var chkParent = document.querySelector(this.drawParent);
		var that = this;

		chkParent.addEventListener('click', function (e) {
			var labelTarget = e.target;
			var tagName = labelTarget.tagName;

			if (tagName === 'LABEL') {
				var isBoolLabel = e.target.previousElementSibling.classList.contains('on');
				var cartNum = Number(labelTarget.parentNode.parentNode.dataset.cartnum);
				e.target.previousElementSibling.classList.toggle('on');

				if (!isBoolLabel) {
					//ajax로 ischeck 변경 post
					that.data[cartNum].ischeck = true;
				} else {
					//ajax로 ischeck 변경 post
					that.data[cartNum].ischeck = false;
				}
				that.priceRender();
			} else {
				return;
			}
		});
	}

	this.chkDelete = function () {
		var chkParent = document.querySelector(this.drawParent);
		var that = this;

		chkParent.addEventListener('click', function (e) {
			var delBtnTarget = e.target;
			var tagName = delBtnTarget.tagName;

			if (tagName === 'BUTTON') {
				var targetIdx = delBtnTarget.parentElement.parentElement.dataset.cartnum;
				if (that.data[targetIdx].ischeck) {
					that.data.splice(targetIdx, 1);
					that.render();
					that.priceRender();
				} else {
					alert('장바구니를 체크해 주세요!!')
				}
			} else {
				return;
			}
		});
	}

	this.totalPrice = function () {
		return this.priceFunc('price');
	}

	this.salePrice = function () {
		return this.priceFunc('saleprice');
	}

	this.priceFunc = function (dataKey) {
		var data = this.data;
		var price = 0;

		data = data.filter(function (list) {
			if (list.ischeck === true) {
				return list;
			}
		});

		var totalArr = data.map(function (items) {
			return items[dataKey];
		});

		if (data.length) {
			price = totalArr.reduce(function (accPrice, curPrice) {
				return accPrice + curPrice;
			});
		}

		return price;
	}

	this.priceRender = function () {
		var cartTotal = document.querySelector('.cart__total-info-box')
		var CreateCartList = '';

		var totalNum = this.totalPrice();
		var saleNum = this.salePrice()

		if (this.data.length) {
			CreateCartList += '<div class="cart__total-info">';
			CreateCartList += '<div class="cart__total-box">';
			CreateCartList += '<div class="basic__price">' + '상품가격 : ' + '<span>' + comma(totalNum) + '</span>' + '</div>';
			CreateCartList += '<div class="sale__price">' + '할인가격 : ' + '<span>' + comma(saleNum) + '</span>' + '</div>';
			CreateCartList += '<div class="total__price">' + '총 결제금액 : ' + '<span>' + comma((totalNum - saleNum)) + '</span>' + '</div>';
			CreateCartList += '<div>' + '<button class="cart__buy-btn">구매하기</button>' + '</div>';
			CreateCartList += '</div>';
			CreateCartList += '</div>';

		} else {
			CreateCartList = '<div class="cart__empty">강좌바구니가 비어있습니다.</div>';
		}

		cartTotal.innerHTML = CreateCartList;
	}

	this.render = function () {
		var data = this.data;
		var parentDrawNode = document.querySelector('.shop__menu-container');

		try {
			if (Array.isArray(this.data)) {
				var CreateCartList = data.reduce(function (html, items, idx) {

					html += '<div class="shop__menu-items" data-cartNum=\"' + (idx) + '\">';
					html += '<div class="shop__menu-chk">';
					html += items.ischeck
						?
						'<input type="checkbox" name=\"chk_' + (idx + 1) + '\" id=\"chk_' + (idx + 1) + '\" class=\"chk_inp on\"/>'
						:
						'<input type="checkbox" name=\"chk_' + (idx + 1) + '\" id=\"chk_' + (idx + 1) + '\" class=\"chk_inp\"/>';
					html += '<label for=\"chk_' + (idx + 1) + '\" class="chk_label"></label>';
					html += '</div>';
					html += '<div class="shop__thums">';
					html += '<img src=\"' + items.img + '\" alt=\"' + items.text + '\">';
					html += '</div>';
					html += '<div class="shop__text ft-18">';
					html += '<p>' + items.text + '</p>'
					html += '</div>';
					html += '<div class="shop__item-info">';
					html += '<div class="shop__item-price">' + comma(items.price - items.saleprice) + '</div>';
					html += '<div class="shop__sale-prev-price">' + comma(items.price) + '</div>';
					html += '<button class="shop__item-delete">삭제</button>';
					html += '</div>';
					html += '</div>';


					return html;
				}, '<div class="shop__menu-wrap">') + '</div>';

				if (this.data.length) {
					CreateCartList += '<div class="cart__total-info-box">';
					CreateCartList += '<div class="cart__total-info">';
					CreateCartList += '<div class="cart__total-box">';
					CreateCartList += '<div class="basic__price">' + '상품가격 : ' + '<span>' + 0 + '</span>' + '</div>';
					CreateCartList += '<div class="sale__price">' + '할인가격 : ' + '<span>' + 0 + '</span>' + '</div>';
					CreateCartList += '<div class="total__price">' + '총 결제금액 : ' + '<span>' + 0 + '</span>' + '</div>';
					CreateCartList += '<div>' + '<button class="cart__buy-btn">구매하기</button>' + '</div>';
					CreateCartList += '</div>';
					CreateCartList += '</div>';
					CreateCartList += '</div>';
				} else {
					CreateCartList = '<div class="cart__empty">강좌바구니가 비어있습니다.</div>';
				}

				parentDrawNode.innerHTML = CreateCartList;
			} else {
				var empty = '<div class="cart__empty">강좌바구니가 비어있습니다.</div>';
				parentDrawNode.innerHTML = empty;

				throw new Error('데이터 에러!!');
			}


			this.checkItems();
			this.chkDelete();
		} catch (error) {
			console.warn(error);
		}
	}
}

function comma(num) {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' 원 ';
}

