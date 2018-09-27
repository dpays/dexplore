import dpay from 'dpayjs';

export default ($rootScope, cryptoService) => {
  const transferMemoFilter = (op) => {

    if(!op.memo){
      return '';
    }

    if (!op.memo.startsWith('#')) {
      return op.memo;
    }

    const activeUser = $rootScope.user.username;
    if(!activeUser){
      return '';
    }

    if(![op.from, op.to].includes(activeUser)){
      return '';
    }

    if($rootScope.user.type === 'sc'){
      return '**Use traditional dPay login to see memo**'
    }

    let privateMemoKey = null;
    try {
      privateMemoKey = cryptoService.decryptKey($rootScope.user.keys['memo']);
    } catch (e) {
      return '';
    }

    try {
      return dpay.memo.decode(privateMemoKey, op.memo);
    } catch (e) {
      return '**Invalid memo**';
    }
  };

  transferMemoFilter.$stateful = true;
  return transferMemoFilter;
};
