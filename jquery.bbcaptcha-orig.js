if(typeof Recaptcha=='undefined'){
	$.getScript("http://www.google.com/recaptcha/api/js/recaptcha_ajax.js");
}


var lang = "cs";
var fail_message = "<p class='red'>Ověřovací kód je chybný, zkuste prosím zadat znovu!</p>";
var theme = "white";

function createRecaptcha(element)
{
	Recaptcha.create("6LdWCeQSAAAAAM2uFmpEIVo1ob2yVh7JrT1_PNTw",element,{
		theme:theme,callback:Recaptcha.focus_response_field
	});
}

function isValidEmail(email) {
	
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (!filter.test(email)){
		showErrors();
		return false;
	} 
	else
	{
		return true;	
	}
}
function isValidContactForm(e,field) {
	
	var email = $(e.target).find(field).val();
	if (isValidEmail(email)) {
		return true;
	};
}

function showErrors() {
	if (lang == 'cs'){
		var msg = 'Vaše emailová adresa je chybná';
	} else {
		var msg = 'Please provide a valid email address';
	}
	alert(msg);
	return false;
}

function isCaptchaCorect(msgbox) {
	var chal=Recaptcha.get_challenge();
	var resp=Recaptcha.get_response();
	var html=$.ajax({
		type:"POST",url:"http://captcha.blueberry.cz/validateform.php",data:"form=signup&recaptcha_challenge_field="+chal+"&recaptcha_response_field="+resp,async:false
		}).responseText;

		if(html=="success")
		{
			return true
		} else {
			$(msgbox).html(fail_message);
			Recaptcha.reload();
			return false
		}
	}

	$(document).ready(function() {

		
		$('form').click(function(e) {
			if ($(this).hasClass('active')) 
				return;
			
			$('form').removeClass('active');
			$(this).addClass('active');
			$('form').find('#captcha').remove();

			Recaptcha.destroy();
			$(this).append("<div id='captcha'></div>");
			createRecaptcha('captcha'); //DisplayCaptchaForm

		});
		
		$(document).on('submit', '.valid-me', function(e) { //Sedn form with valid-me class

			if (isValidContactForm(e,"input#emailformpu")) { // If is valid contact form

				if (isCaptchaCorect("#recaptcha_result")) { // If captcha is corect
					return true;
				} else {
					return false;	
				}
			} else {
				return false;
			}
		});
	});