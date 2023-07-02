import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import * as React from 'react';

import { TransactionStates } from '@/components/TriggerValues/Time';

export default function LoadingScreen({
  isApproving,
  isApproved,
  isTransactionSuccessFul,
  isTransactionFailed,
  handleClose,
}: TransactionStates & {
  handleClose: () => void;
}) {
  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={
          isApproving ||
          isApproved ||
          isTransactionSuccessFul ||
          isTransactionFailed
        }
        onClick={() => {
          if (isTransactionFailed || isTransactionSuccessFul) {
            handleClose();
          } else {
            return null;
          }
        }}
      >
        <CircularProgress color='inherit' />
        {isApproving && <p>Getting Token Allowance</p>}
        {isApproved && <p>Adding transaction</p>}
        {isTransactionSuccessFul && <p>Transaction Successful</p>}
        {isTransactionFailed && <p>Transaction Failed</p>}
      </Backdrop>
    </div>
  );
}
