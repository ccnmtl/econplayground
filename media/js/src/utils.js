define(['jquery'], function($) {
    var utils = {
        onLocalLogin: function(evt) {
            evt.preventDefault();

            var $frm = jQuery('form#login-local');

            $.ajax({
                type: 'POST',
                url: evt.target.action,
                data: $(evt.target).serialize(),
                success: function(response) {
                    if ('error' in response) {
                        $frm.find('.local-login-errors').show();
                    } else {
                        // redirect to the required url
                        /* eslint-disable scanjs-rules/assign_to_location */
                        window.location = response.next;
                        /* eslint-enable scanjs-rules/assign_to_location */
                    }
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    $frm.find('.local-login-errors').show();
                }
            });
            return false;
        }
    };

    return utils;
});
