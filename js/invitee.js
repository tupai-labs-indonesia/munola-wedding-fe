import { dto } from './dto.js';
import { util } from './util.js';
import { session } from './session.js';
import { request, HTTP_GET, HTTP_POST, HTTP_DELETE, HTTP_PUT } from './request.js';

export const invitee = (() => {

    const send = async (button) => {
        const id = button.getAttribute('data-uuid');

        const name = document.getElementById("form-recipient-name");
        const phone = document.getElementById("form-recipient-phone");

        if (name.value.length == 0) {
            alert('Please fill name');
            return;
        }
        if (phone.value.length == 0) {
            alert('Please fill phone');
            return;
        }

        name.disabled = true;
        phone.disabled = true;

        const btn = util.disableButton(button);

        const response = await request(HTTP_POST, '/api/invitee')
            .token(session.getToken())
            .body(dto.postInviteeRequest(name.value, phone.value, "https://staging.munola.com", "kakap"))
            .send(dto.postInviteeResponse)
            .then((res) => {
                if(res.code == 201){
                    Swal.fire({
                        footer: "munola.com",
                        title: "Kirim Undangan?",
                        text: "Untuk: " + res.data.name + "(" + res.data.phone_number + ")",
                        icon: "success",
                        confirmButtonColor: "#075E54",
                        confirmButtonText: "Kirim WhatsApp",
                        }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = res.data.whatsapp_link;
                        }
                    });
                }
            });

        btn.restore();

        if (!response || response.code !== 201) {
            return;
        }
    };

    return {
        send
    }
})();