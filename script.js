// ========================================
// INDHU BEAUTY STUDIO
// APPOINTMENT SELECTION SYSTEM
// ========================================

const selectedItems = [];

const addButtons = document.querySelectorAll(".add-btn");

const selectedServicesBox =
    document.getElementById("selected-services");

const totalPriceElement =
    document.getElementById("total-price");

const cartCount =
    document.getElementById("cart-count");

const bookingForm =
    document.getElementById("booking-form");

const appointmentDate =
    document.getElementById("appointment-date");


// ========================================
// DO NOT ALLOW PAST DATES
// ========================================

const today = new Date();

const year = today.getFullYear();

const month =
    String(today.getMonth() + 1).padStart(2, "0");

const day =
    String(today.getDate()).padStart(2, "0");

appointmentDate.min =
    `${year}-${month}-${day}`;


// ========================================
// ADD / REMOVE BUTTON
// ========================================

addButtons.forEach(button => {

    button.addEventListener("click", function () {

        const name =
            this.dataset.name;

        const priceValue =
            this.dataset.price;

        const startingPrice =
            this.dataset.starting === "true";


        const existingIndex =
            selectedItems.findIndex(
                item => item.name === name
            );


        // REMOVE IF ALREADY SELECTED

        if (existingIndex !== -1) {

            selectedItems.splice(existingIndex, 1);

            this.classList.remove("added");

            this.textContent = "+ Add";

        }

        // ADD NEW ITEM

        else {

            let price = null;

            if (priceValue !== "contact") {

                price = Number(priceValue);

            }


            selectedItems.push({

                name: name,

                price: price,

                starting: startingPrice

            });


            this.classList.add("added");

            this.textContent = "✓ Added";

        }


        updateBooking();

    });

});


// ========================================
// UPDATE BOOKING CART
// ========================================

function updateBooking() {

    selectedServicesBox.innerHTML = "";

    cartCount.textContent =
        selectedItems.length;


    // EMPTY CART

    if (selectedItems.length === 0) {

        selectedServicesBox.innerHTML = `
            <p class="empty-message">
                No services or classes selected yet.
            </p>
        `;

        totalPriceElement.textContent = "₹0";

        return;

    }


    let total = 0;


    selectedItems.forEach(item => {

        const row =
            document.createElement("div");

        row.className = "selected-item";


        let priceText =
            "Please Contact";


        if (item.price !== null) {

            total += item.price;

            priceText =
                `${item.starting ? "From " : ""}₹${item.price.toLocaleString("en-IN")}`;

        }


        row.innerHTML = `
            <div class="selected-item-info">

                <span>${item.name}</span>

                <small>${priceText}</small>

            </div>

            <button
                type="button"
                class="remove-btn"
                data-remove="${item.name}">
                Remove
            </button>
        `;


        selectedServicesBox.appendChild(row);

    });


    totalPriceElement.textContent =
        "₹" + total.toLocaleString("en-IN");


    // REMOVE BUTTONS INSIDE CART

    const removeButtons =
        document.querySelectorAll(".remove-btn");


    removeButtons.forEach(button => {

        button.addEventListener("click", function () {

            const itemName =
                this.dataset.remove;


            const index =
                selectedItems.findIndex(
                    item => item.name === itemName
                );


            if (index !== -1) {

                selectedItems.splice(index, 1);

            }


            // RESET ORIGINAL ADD BUTTON

            addButtons.forEach(addButton => {

                if (
                    addButton.dataset.name === itemName
                ) {

                    addButton.classList.remove("added");

                    addButton.textContent = "+ Add";

                }

            });


            updateBooking();

        });

    });

}


// ========================================
// WHATSAPP BOOKING
// ========================================

bookingForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // MUST SELECT SOMETHING

        if (selectedItems.length === 0) {

            alert(
                "Please select at least one service or class."
            );

            document
                .getElementById("services")
                .scrollIntoView({
                    behavior: "smooth"
                });

            return;

        }


        const customerName =
            document
                .getElementById("customer-name")
                .value
                .trim();


        const customerPhone =
            document
                .getElementById("customer-phone")
                .value
                .trim();


        const date =
            document
                .getElementById("appointment-date")
                .value;


        const time =
            document
                .getElementById("appointment-time")
                .value;


        if (
            !customerName ||
            !customerPhone ||
            !date ||
            !time
        ) {

            alert(
                "Please complete all appointment details."
            );

            return;

        }


        // ========================================
        // BUILD SERVICE LIST
        // ========================================

        let itemMessage = "";

        let total = 0;

        let containsFlexiblePrice = false;


        selectedItems.forEach(item => {

            let priceText =
                "Please Contact";


            if (item.price !== null) {

                total += item.price;

                priceText =
                    `${item.starting ? "From " : ""}₹${item.price.toLocaleString("en-IN")}`;

                if (item.starting) {

                    containsFlexiblePrice = true;

                }

            }

            else {

                containsFlexiblePrice = true;

            }


            itemMessage +=
                `• ${item.name} - ${priceText}\n`;

        });


        // ========================================
        // FORMAT DATE
        // ========================================

        const dateObject =
            new Date(date + "T00:00:00");


        const formattedDate =
            dateObject.toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        // ========================================
        // WHATSAPP MESSAGE
        // ========================================

        let message =

`Hello INDHU BEAUTY STUDIO,

I would like to request an appointment.

Name: ${customerName}
Mobile: ${customerPhone}
Date: ${formattedDate}
Preferred Time: ${time}

Selected Services / Classes:
${itemMessage}
Estimated Total: ₹${total.toLocaleString("en-IN")}`;


        if (containsFlexiblePrice) {

            message +=
`\n
Some selected services/classes require final price confirmation.`;

        }


        message +=
`\n
Please confirm whether this appointment slot is available.

Thank you.`;


        const salonNumber =
            "918220431075";


        const whatsappURL =
            `https://wa.me/${salonNumber}?text=${encodeURIComponent(message)}`;


        window.open(
            whatsappURL,
            "_blank"
        );

    }
);