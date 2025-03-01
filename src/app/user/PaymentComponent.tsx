"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makePayment } from "../redux/slices/actionsSlice";
import { AppDispatch, RootState } from "../redux/store";
import { Form, Button, Typography, message } from "antd";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../utils/api";



const { Title, Paragraph } = Typography;

// Load Stripe with the public key from .env
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface PaymentFormProps {
  postId: string;
  userId: string;
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ postId, userId, onSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const paymentStatus = useSelector((state: RootState) => state.action.paymentStatus);
  console.log('this is th paymentStatus:', paymentStatus)
  const stripe = useStripe();
  const elements = useElements();


  const handlePayment = async () => {
    if (!stripe || !elements) {
      message.error("Stripe is not loaded yet. Please try again.");
      return;
    }
  
    const resultAction = await dispatch(makePayment({ postId, userId }));
    if (makePayment.fulfilled.match(resultAction)) {
      const { clientSecret } = resultAction.payload;
  
      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement!,
        },
      });
  
      if (paymentResult.error) {
          message.error(paymentResult.error.message || "Payment failed. Please try again.");
        } else if (paymentResult.paymentIntent && paymentResult.paymentIntent.status === "succeeded") {
        const paymentIntentId = paymentResult.paymentIntent.id;
      
        try {
          const response = await api.checkPaymentStatus(paymentIntentId); 
           console.log('this is response of payment from:', response)
          if (response.data.status === "succeeded") {
            message.success("Payment successful and recorded!");
            onSuccess();
          } else {
            message.error("Payment status verification failed. Please contact support.");
          }
        } catch{
          message.error("Failed to record payment. Please contact support.");
        }
      }
    } else {
      message.error("Payment failed. Please try again.");
    }
  };
  
  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Payment</Title>
      <Form layout="vertical" onFinish={handlePayment}>
        <Form.Item label="Card Details" required>
          <CardElement />
        </Form.Item>
        <Button type="primary" htmlType="submit" disabled={!stripe}>
          Pay Now
        </Button>
      </Form>
      {paymentStatus && <Paragraph>{paymentStatus}</Paragraph>}
    </div>
  );
};

interface PaymentComponentProps {
  postId: string;
  userId: string;
  onSuccess: () => void;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({ postId,  onSuccess }) => {
    const userId = useSelector((state: RootState) => state.auth.user?._id);

    console.log('Received postId in PaymentComponent:', postId);
  return (
    <Elements stripe={stripePromise}>
      {userId &&<PaymentForm postId={postId} userId={userId} onSuccess={onSuccess} />}
    </Elements>
  );
};

export default PaymentComponent;
