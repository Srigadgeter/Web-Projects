Vue.component('tabs',{
	template : `<div>
					<div class="nav nav-pills nav-justified">
						<li v-for="item in navItemsArray" :class="{ active : item.isActive }"><a @click="selectedMenuItem(item)">{{ item.name }}</a></li>
						</div>
					<div><slot></slot></div>
				</div>`,
	data(){
		return {
			navItemsArray : []			
		}
	},
	mounted(){
		this.navItemsArray = this.$children
	},
	methods : {
		selectedMenuItem(item){
			this.navItemsArray.forEach(i => {
				i.isActive = (i == item)
			})
		}
	}
})

Vue.component('tab',{
	template : `<div v-show="isActive" id="tab-content">
					<slot></slot>
				</div>`,
	props : {
		name : {
			required : true
		},
		selected : {
			default : false
		}
	},
	data(){
		return {
			isActive : false
		}
	},
	mounted() {
		this.isActive = this.selected
	}
})

new Vue({
	el : '#app',
	data : {
		newHotel : {
			name : '',
			location : '',
			contact : null,
			totalRooms : null
		},
		hotels : [],
		refId : '',
		pass : '',
		newBooking : {
			bookedName : '',
			bookedDate : '',
			phoneNumber : null,
			roomCount : null
		},
		bookings : [],
		hotelIndex : null
	},
	methods : {
		addHotel(){
			if(this.validation()){
				var ref = ''

				ref += this.newHotel.name.slice(NaN,1)	// it brings first letter
				ref += this.newHotel.contact
				console.log('ref id = '+ref)

				this.hotels.push({
					name : this.newHotel.name,
					location : this.newHotel.location,
					contact : this.newHotel.contact,
					totalRooms : this.newHotel.totalRooms,
					availableRooms : this.newHotel.totalRooms,
					referenceId : ref,
					bookings : []
				})
				this.timeoutFunction('finalFieldSuccess', 'Hotel Added Successfully', false, 2000)
				this.timeoutFunction('finalFieldInfo', 'Hotel '+this.newHotel.name+', Reference Id is <strong>'+ref+'</strong>', true, 5000)
				document.getElementById('finalFieldInfo').focus()

				this.newHotel.name = ''
				this.newHotel.location = ''
				this.newHotel.contact = null
				this.newHotel.totalRooms = null
				console.log('---------------------------------> data added')

				if(this.hotels.length > 0){
					setTimeout(function(){
						document.getElementById('hotelDetails').style.display = "block"
					},1000)
				}
			}
		},
		deleteHotel(index){
			console.log("hotel index = "+index)
			this.hotels.splice(index,1)
			if(this.hotels.length === 0)
				document.getElementById('hotelDetails').style.display = "none"
		},
		timeoutFunction(elementId, errorMsg, isHTML, timePeriod){
			if(isHTML)
				document.getElementById(elementId).innerHTML = errorMsg
			else
				document.getElementById(elementId).innerText = errorMsg
			document.getElementById(elementId).style.display = "block"

			setTimeout(function(){
				document.getElementById(elementId).style.display = "none"
				document.getElementById(elementId).innerText = ''
			},timePeriod)
		},
		validation(){
			var nn = false, ll = false, c1 = false, c2 = false, t1 = false, t2 = false, t3 = false, sameData = false
			var counter = 0

			this.newHotel.name.length < 1 ? this.timeoutFunction('nameField', 'Name should not be empty', false, 2000) : nn = true
			this.newHotel.location.length < 1 ? this.timeoutFunction('locationField', 'Location should not be empty', false, 2000) : ll = true
			this.newHotel.contact === null ? this.timeoutFunction('contactField', 'Contact should not be empty', false, 2000) : (c1 = true) & 
				(this.newHotel.contact.match(/^\d{10}$/) === null ? this.timeoutFunction('contactField', 'Contact should be a whole number with 10 digits', false, 2000) : c2 = true)
			this.newHotel.totalRooms === null ? this.timeoutFunction('totalRoomsField', 'Total Rooms should not be empty', false, 2000) : (t1 = true) &
				(this.newHotel.totalRooms.match(/^\d+$/) === null ? this.timeoutFunction('totalRoomsField', 'Total Rooms should be a whole number', false, 2000) : (t2 = true) & 
					(parseInt(this.newHotel.totalRooms) === 0 ? this.timeoutFunction('totalRoomsField', 'Total Rooms should not be zero initially', false, 2000) : t3 = true))

			if(nn && ll && c1 && c2 && t1 && t2 && t3){
				if(localStorage.getItem('hotels')){
					var hotelList = JSON.parse(localStorage.getItem('hotels'))

					for (var i = 0; i <= hotelList.length - 1; i++) {
						if(hotelList[i].contact === this.newHotel.contact){
							console.log('found')
							this.timeoutFunction('finalField', 'Hotel Already Exists', false, 2000)
							break;
						}
						else
							counter++
						console.log('counter = ' +counter)
					}

					if(counter == hotelList.length)
						sameData = true;	
				}
			}
			return sameData
		},
		loginAccount(){
			var counter = 0, num = 0
			var key = ''
			var ho = false, hn = false, pwd = false

			this.hotels.length < 1 ? this.timeoutFunction('finalAlert', 'No Hotels is Registered in OYO', false, 2000) : ho = true

			if(ho){
				this.refId.length < 1 ? this.timeoutFunction('refIdField', 'Reference Id should not be empty', false, 2000) : hn = true
				this.pass.length < 1 ? this.timeoutFunction('passwordField', 'Password should not be empty', false, 2000) : pwd = true
				if(hn && pwd){
					if(localStorage.getItem('hotels')){
						var hotelList = JSON.parse(localStorage.getItem('hotels'))

						for (var i = 0; i <= hotelList.length - 1; i++) {
							if(hotelList[i].referenceId === this.refId){
								this.hotelIndex = i
								console.log('hotelIndex --> '+this.hotelIndex)
								if(hotelList[i].referenceId === this.pass){
									this.timeoutFunction('finalAlertSuccess', '<strong>'+hotelList[this.hotelIndex].name.toUpperCase()+'</strong>, Logged in Successfully', true, 2000)
									document.getElementById('finalAlertSuccess').focus()
									this.pass = ''

									setTimeout(function(){
										document.getElementById('loginByHotels').style.display = "none"
										document.getElementById('logoutBtn').style.display = "block"
										document.getElementById('bookingForm').style.display = "block"
									},1000)
									
									if(this.hotels[this.hotelIndex].bookings.length > 0){
										this.bookings = []
										this.bookings = this.hotels[this.hotelIndex].bookings

										setTimeout(function(){
											document.getElementById('bookingDetails').style.display = "block"
										},1000)
									}
								}else{
									this.pass = ''
									this.timeoutFunction('passwordField', 'Invalid Password', false, 2000)
								}
								break;
							}
							else
							counter++
							console.log('counter = ' +counter)
						}

						if(counter == hotelList.length){
							this.pass = ''
							this.timeoutFunction('refIdField', 'Invalid Reference Id / Not Registered in OYO', false, 2000)
						}
					}
				}
			}
		},
		commonBooking(mode){
			if(this.validateBooking()){
				this.hotels[this.hotelIndex].bookings.push({
					bookedName : this.newBooking.bookedName,
					bookedDate : this.newBooking.bookedDate,
					phoneNumber : this.newBooking.phoneNumber,
					roomCount : this.newBooking.roomCount,
					bookedMode : mode
				})
				this.hotels[this.hotelIndex].availableRooms -= this.newBooking.roomCount
				this.timeoutFunction('finalbookedSuccessAlert', 'Room Booked Successfully', false, 2000)
				document.getElementById('finalbookedSuccessAlert').focus()

				this.newBooking.bookedName = ''
				this.newBooking.bookedDate = ''
				this.newBooking.phoneNumber = null
				this.newBooking.roomCount = null
			}
		},
		addBooking(){
			mode = 'Offline'
			this.commonBooking(mode)
			if(this.hotels[this.hotelIndex].bookings.length > 0){
				this.bookings = []
				this.bookings = this.hotels[this.hotelIndex].bookings
				setTimeout(function(){
					document.getElementById('bookingDetails').style.display = "block"
				},1000)
			}
		},
		deleteBooking(index){
			console.log("bookingindex = "+index)
			console.log(this.hotels[this.hotelIndex].bookings[index].roomCount)
			this.hotels[this.hotelIndex].availableRooms = parseInt(this.hotels[this.hotelIndex].availableRooms) + parseInt(this.hotels[this.hotelIndex].bookings[index].roomCount)
			this.hotels[this.hotelIndex].bookings.splice(index,1)
			if(this.hotels[this.hotelIndex].bookings.length === 0)
				document.getElementById('bookingDetails').style.display = "none"
		},
		validateBooking(){
			var bn = false, bd = false, pn1 = false, pn2 = false, rc1 = false, rc2 = false, rc3 = false, rc4 = false
			this.newBooking.bookedName.length < 1 ? this.timeoutFunction('bookedNameField', 'Booking Name should not be empty', false, 2000) : bn = true
			this.newBooking.bookedDate.length < 1 ? this.timeoutFunction('bookedDateField', 'Booking Date should not be empty', false, 2000) : bd = true
			this.newBooking.phoneNumber === null ? this.timeoutFunction('phoneNumberField', 'phoneNumber should not be empty', false, 2000) : (pn1 = true) & 
				(this.newBooking.phoneNumber.match(/^\d{10}$/) === null ? this.timeoutFunction('phoneNumberField', 'phoneNumber should be a whole number with 10 digits', false, 2000) : pn2 = true)
			this.newBooking.roomCount === null ? this.timeoutFunction('roomCountField', 'Booking Room Count should not be empty', false, 2000) : (rc1 = true) &
				(this.newBooking.roomCount.match(/^\d+$/) === null ? this.timeoutFunction('roomCountField', 'Booking Room Count should be a whole number', false, 2000) : (rc2 = true) & 
					(parseInt(this.newBooking.roomCount) === 0 ? this.timeoutFunction('roomCountField', 'Booking Room Count should not be zero initially', false, 2000) : (rc3 = true) &
						(parseInt(this.hotels[this.hotelIndex].availableRooms) < parseInt(this.newBooking.roomCount) ? this.timeoutFunction('roomCountField', 'Booking Room Count should not be greater than Available Rooms', false, 2000) : rc4 = true)))
				if(bn && bd && pn1 && pn2 && rc1 && rc2 && rc3 && rc4)
					return true
				else
					return false
		},
		logoutAccount(){
			setTimeout(function(){
				document.getElementById('logoutBtn').style.display = "none"
				document.getElementById('loginByHotels').style.display = "block"
				document.getElementById('bookingForm').style.display = "none"
				document.getElementById('bookingDetails').style.display = "none"
			},500)
			this.bookings = []
			this.hotelIndex = null
			this.refId = ''
		},
		showForm(index){
			this.hotelIndex = index
			document.getElementById('onlineBookingForm').style.display = "block"
		},
		addOnlineBooking(){
			var mode = 'Online'
			this.commonBooking(mode)
		}
	},
	created() {
		console.log("-----------------------------> app created")
	},
	mounted() {
		console.log('-----------------------------> app mounted !')
		if(localStorage.getItem('hotels'))
			this.hotels = JSON.parse(localStorage.getItem('hotels'))

		if(this.hotels.length > 0){
			setTimeout(function(){
				document.getElementById('hotelDetails').style.display = "block"
			},1000)
		}
	},
	watch: {
		hotels : {
			handler() {
				localStorage.setItem('hotels', JSON.stringify(this.hotels))
				console.log('*******hotels data changed*******')
			},
			deep : true
		}
	}	
})



