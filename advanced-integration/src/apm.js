import React, { useEffect, useRef } from "react";
import { useStore } from "./store";

export default function PayPalMarkContainer() {
    const elementRef = useRef();
    const selectedFundingSource = useStore(store => store.buttons.selectedFundingSource);

    useEffect(() => {
        paypal
        .PaymentFields({
          fundingSource: selectedFundingSource,
          style: {
            variables: {
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSizeBase: "0.9375rem",
              fontSizeSm: "0.93rem",
              fontSizeM: "0.93rem",
              fontSizeLg: "1.0625rem",
              textColor: "#2c2e2f",
              colorTextPlaceholder: "#2c2e2f",
              colorBackground: "#fff",
              colorInfo: "#0dcaf0",
              colorDanger: "#d20000",
              borderRadius: "0.2rem",
              borderColor: "#dfe1e5",
              borderWidth: "1px",
              borderFocusColor: "black",
              spacingUnit: "10px",
            },
            rules: {
              ".Input": {},
              ".Input:hover": {},
              ".Input:focus": {
              },
              ".Input:active": {},
              ".Input--invalid": {},
              ".Label": {},
              ".Error": {
                marginTop: '2px',
              },
            },
          },
          fields: {
            name: {
              value: "",
            },
          },
        })
        .render(elementRef.current);
    }, [])

    

  return (
    <div className="marks-fields-container" ref={elementRef}></div>
  )
}