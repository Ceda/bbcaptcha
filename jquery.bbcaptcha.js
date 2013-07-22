(function($){
    $.BbCaptcha = function(el, fail_message, theme, lang, msg, validate_url, validate_form_class, recaptcha_field, recaptcha_result_filed, email_input, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("BbCaptcha", base);
        
        base.init = function(){
            base.fail_message = fail_message;
            base.theme = theme;
            base.lang = lang;
            base.msg = msg;
            base.validate_url = validate_url;
            base.validate_form_class = validate_form_class;
            base.recaptcha_field = recaptcha_field;
            base.recaptcha_result_filed = recaptcha_result_filed;
            base.email_input = email_input;
            base.options = $.extend({},$.BbCaptcha.defaultOptions, options);
            
            // Put your initialization code here
        };
        
        // Sample Function, Uncomment to use
        // base.functionName = function(paramaters){
        // 
        // };

				base.createRecaptcha = function(element)
				{
					Recaptcha.create("6LdWCeQSAAAAAM2uFmpEIVo1ob2yVh7JrT1_PNTw",element,{
						theme:theme,callback:Recaptcha.focus_response_field
					});
				}

				base.isValidEmail = function(email) {

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

				base.isValidContactForm = function(e,field) {

					var email = $(e.target).find(field).val();
					if (isValidEmail(email)) {
						return true;
					};
				}

				base.showErrors = function() {
					if (lang == 'cs'){
						var msg = 'Vaše emailová adresa je chybná';
					} else {
						var msg = 'Please provide a valid email address';
					}
					alert(msg);
					return false;
				}
        
				base.isCaptchaCorect = function(msgbox) {
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
					
        // Run initializer
        base.init();
    };
    
    $.BbCaptcha.defaultOptions = {
        fail_message: "<p class='red'>Ověřovací kód je chybný, zkuste prosím zadat znovu!</p>",
        theme: "white",
        lang: "cs",
        msg: "Vaše emailová adresa je chybná",
        validate_url: "http://captcha.blueberry.cz/validateform.php",
        validate_form_class: ".valid-me",
        recaptcha_field: "",
        recaptcha_result_filed: "#recaptcha_result",
        email_input: "input#email"
    };
    
    $.fn.bbCaptcha = function(fail_message, theme, lang, msg, validate_url, validate_form_class, recaptcha_field, recaptcha_result_filed, email_input, options){
        return this.each(function(){
	
            (new $.BbCaptcha(this, fail_message, theme, lang, msg, validate_url, validate_form_class, recaptcha_field, recaptcha_result_filed, email_input, options));
        });
    };
    
})(jQuery);
