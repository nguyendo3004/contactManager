const urlBase = 'http://contactmanager.site/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let date = 0;
/*Contact Variables */
let contactID = 0;
let contactFName = "";
let contactLastName = "";
let contactPhone = "";
let contactEmail = "";
let contactAddress = "";
let contactNotes = "";

//creating an arr of contacts to store results from search
let contactFNameArr = [];
let contactLastNameArr= [];
let contactIDArr = [];
let contactPhoneArr = [];
let contactEmailArr = [];
let contactAddressArr = [];
let	contactNotesArr = [];




//works!!
function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	

	let Login = document.getElementById("loginName").value;
	
	let Password = document.getElementById("loginPassword").value;

//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {Login:Login,Password:Password,DateLastLoggedIn: date};
//	var tmp = {login:login,password:hash};

	let jsonPayload = JSON.stringify(tmp);
	
	let url = urlBase + '/Login.' + extension;


	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				
				let jsonObject = JSON.parse( xhr.responseText );
				
				//might need to change UserID to id
				userId = jsonObject.UserID;
				//alert(userId);
				

				if( userId == undefined )
				{		
					document.getElementById("loginResult").innerHTML = "Incorrect Username or Password";
					return;
				}
				
				else{
					firstName = jsonObject.firstName;
					lastName = jsonObject.lastName;

					

					//might need to add readCookie()

					saveCookie();
		
					window.location.href = "contact.html";
				}
			}
		};
		
		xhr.send(jsonPayload);
		
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}
// function updateLoginDate(){

// 	date = new Date();

// 	let url = urlBase + '/DateLastLoggedIn.' + extension;

// 	let xhr = new XMLHttpRequest();
// 	xhr.open("POST", url, true);
// 	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
// 	try
// 	{
// 		xhr.onreadystatechange = function() 
// 		{
// 			if (this.readyState == 4 && this.status == 200) 
// 			{
// 				alert(xhr.responseText );
// 				let jsonObject = JSON.parse( xhr.responseText );
				
// 				userId = jsonObject.UserID;
// 				alert(userId);
// 				if( userId < 1 )
// 				{		
					
// 					return;
// 				}
		
			
// 				date = jsonObject.DateLastLoggedIn;

// 				saveCookie();
	
				
// 			}
// 		};
// 		xhr.send(jsonPayload);
// 	}
	

// }


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}
//works!!
function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
//works!!
function addContact()
{
	//the contactText comes from the HTML page
	let FirstName = document.getElementById("firstName").value;
	let LastName = document.getElementById("lastName").value;
	let Phone = document.getElementById("phoneNumber").value;
	let Email = document.getElementById("emailVal").value;
	let Address = document.getElementById("address").value;
	let Notes = document.getElementById("notes").value;
	
	document.getElementById("contactAddResult").innerHTML = "";

	//contact PHP: HTML
	let tmp = {FirstName: FirstName, LastName: LastName, Phone: Phone, Email: Email, 
		Address: Address, Notes: Notes, UserID: userId};

	let jsonPayload = JSON.stringify( tmp );
	alert(jsonPayload);
	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Success! Your new contact has been added!";
			}
		};
		xhr.send(jsonPayload);
		alert(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}
//works again!!
function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";
	let contactListTest = "";// TESTING THIS!!!!!!!!!!!!!!!!!!!!!!!!!!!!


	let tmp = {Search:srch, ID:userId};
	
	let jsonPayload = JSON.stringify( tmp );
	//alert(jsonPayload);
	let url = urlBase + '/Search.' + extension;

	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try
	{
		xhr.onreadystatechange = function() 
		{
			//alert("we made it here 1");
			if (this.readyState == 4 && this.status == 200) 
			{
				//alert("we made it here 2");
				document.getElementById("contactSearchResult").innerHTML = "Here are your contacts related to that search!";
				let jsonObject = JSON.parse( xhr.responseText );
				//alert(jsonObject);

				//contactList = jsonObject.results[0].FirstName;
				//alert(jsonObject.results.length);
				
				for( let i=0; i<jsonObject.results.length; i++ )//issue is here
				{
					
					
					//contactListTest += "<button>" + jsonObject.results[i].FirstName + " " + jsonObject.results[i].LastName + "</button>";
					
					//this line creates a button that displays the first and last name of the contact and takes you to the update contact page
					contactListTest += '<button type="button" id="contactResults" onclick= \"window.location.href = \'updateContact.html/?contactid='+ contactID + '&firstname='+contactFName+ '\'\"' + jsonObject.results[i].FirstName + " " + jsonObject.results[i].LastName + "</button>";
					//now I will store each variable into the arr of different attributes so that once you click a button the 
					contactFName = jsonObject.results[i].FirstName;
					contactLastName= jsonObject.results[i].LastName;
					contactPhone = jsonObject.results[i].Phone;
					contactEmail = jsonObject.results[i].Email;
					contactAddress= jsonObject.results[i].Address;
					contactNotes = jsonObject.results[i].Notes;
					contactID = jsonObject.results[i].TableID;
					// sessionStorage.setItem("contactFName", contactFName );
					// sessionStorage.setItem("contactLastName", contactLastName );
					// sessionStorage.setItem("contactPhone", contactPhone );
					// sessionStorage.setItem("contactEmail", contactEmail );
					// sessionStorage.setItem("contactAddress", contactAddress );
					// sessionStorage.setItem("contactNotes", contactNotes );
					// sessionStorage.setItem("contactID", contactID );

					/*Have to store the contact's values when going to the update page then 
					in the update page display CLICKABLE information about the contact
					when user clicks on a field and edits a field, we have to send  */
					// contactList += jsonObject.results[i].FirstName + " ";
					// contactList += jsonObject.results[i].LastName + " ";
					// contactList += jsonObject.results[i].Phone + " ";
					// contactList += jsonObject.results[i].Email + " ";
					// contactList += jsonObject.results[i].Address + " ";
					// contactList += jsonObject.results[i].Notes + " ";
					//contactList += jsonObject.results[i].TableID + " ";
					

					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
						//alert(contactList);
					}
				}

				// contactFName = jsonObject.results[0].FirstName;
				// contactLastName = jsonObject.results[0].LastName;
				// contactPhone = jsonObject.results[0].Phone;
				// contactEmail = jsonObject.results[0].Email;
				// contactAddress = jsonObject.results[0].Address;
				// contactNotes = jsonObject.results[0].Notes;
				// contactID = jsonObject.results[0].TableID;
				
				

				
				//document.getElementsByTagName("p")[0].innerHTML = contactList;
				document.getElementsByTagName("ul")[0].innerHTML = contactListTest; //TESTING THIS!!!
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}


}
// //this function stores the information of a contact on click
function getContactInfo(){
	
	
	const queryString = window.location.search;
	console.log(queryString);

	const urlParams = new URLSearchParams(queryString);

	const product = urlParams.get('contactid');
	console.log(product);

	const newUser = urlParams.get('contactFName');
	console.log(newUser);
	
	// contactFName = sessionStorage.getItem("contactFName");
	// contactLastName = sessionStorage.getItem("contactLastName");
	// contactPhone = sessionStorage.getItem("contactPhone");
	// contactEmail = sessionStorage.getItem("contactEmail");
	// contactAddress = sessionStorage.getItem("contactAddress");
	// contactNotes = sessionStorage.getItem("contactNotes");
	// contactID = sessionStorage.getItem("contactID");
	// console.log(contactFName, contactLastName,contactPhone, contactEmail, contactAddress, contactNotes, contactID);

}
//works!!
function doCreateUser(){

	let FirstName = document.getElementById("userFirst").value;
	let LastName = document.getElementById("userLast").value;
	let Login = document.getElementById("loginNew").value;
	let Password = document.getElementById("pwNew").value;
	
	document.getElementById("newUser").innerHTML = "";

	let tmp = {FirstName: FirstName, LastName: LastName, Login: Login, Password: Password};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddUser.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("newUser").innerHTML = "Your account was successfully created!";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("newUser").innerHTML = err.message;
	}

	//takes the user to the contact page after creating account
	window.location.href = "contact.html";

}

function updateContact(){

	//php: UserID, ContactID
	
	//userId = 1;
	let srch = document.getElementById("firstNametoUpdate").value;
	alert(srch);
	
	document.getElementById("contactUpdateResult").innerHTML = "";

	

	let tmp = {ContactID: contactID, UserID: userId, NewFirstName: srch, NewLastName: contactLastName, NewPhone: contactPhone, NewEmail: contactEmail, 
		NewAddress: contactAddress, NewNotes: contactNotes };
	let jsonPayload = JSON.stringify(tmp);
	alert(jsonPayload);

	let url = urlBase + '/UpdateContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactUpdateResult").innerHTML = "Contact has been updated!";
			}
		};
		xhr.send(jsonPayload);
		alert(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactUpdateResult").innerHTML = err.message;
	}

}

function deleteContact(){

	//TableID = $inData["ContactID"];
	

	let srch = document.getElementById("delContactId").value;
	alert(srch);
	
	//document.getElementById("contactDeleteResult").innerHTML = "";

	

	let tmp = {ContactID: srch, UserID: userId};
	alert(tmp);
	let jsonPayload = JSON.stringify(tmp);
	//alert(tmp);
	alert(jsonPayload);

	let url = urlBase + '/DeleteContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted!";
			}
		};

		xhr.send(jsonPayload);
		alert(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactDeleteResult").innerHTML = err.message;
	}

}