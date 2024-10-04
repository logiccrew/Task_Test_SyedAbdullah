// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


contract billionDollarMind {
    address payable public adminWallet; ///< The address of the contract administrator.
    bool public paused; ///< Indicates whether the contract is paused or not.
    address private signer; ///< The address of the signer for signature verification.

    /// @notice Emitted when an investment is made.
    /// @param user The address of the investor.
    /// @param amount The amount invested in Wei.
    event Invest(address indexed user, uint256 amount);

    /// @notice Emitted when a withdrawal is made.
    /// @param user The address of the recipient.
    /// @param amount The amount withdrawn in Wei.
    event Withdraw(address indexed user, uint256 amount);

    /// @notice Mapping to keep track of used nonces for preventing replay attacks.
    mapping(address => mapping(uint256 => bool)) private usedNonces;
    mapping (address => bool) private blockList;
    mapping (address => bool) private unblockList;

    /// @notice Constructor to initialize the contract with the admin wallet and signer address.
    /// @param _adminWallet The address of the contract administrator.
    /// @param _signer The address of the signer for signature verification.
    constructor(address payable _adminWallet, address _signer) {
        require(_adminWallet != address(0), "Admin Wallet address cannot be zero");
        require(_signer != address(0), "Signer address cannot be zero");
        adminWallet = _adminWallet;
        signer = _signer;
        paused = false;
    }

    /// @notice Modifier to restrict function access to the contract owner (admin).
    modifier onlyOwner() {
        require(msg.sender == adminWallet, "Only admin can call this function");
        _;
    }

    /// @notice Pauses or unpauses the contract.
    /// @param _paused Boolean indicating whether to pause or unpause the contract.
    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
    }

    /// @notice Allows users to invest in the contract.
    /// @param _amount The amount to invest in Ether.
    /// @dev The amount should be sent in Wei and should match the provided _amount.
    function invest(uint256 _amount) public payable {
        require(blockList[msg.sender]!=true,"Your Address is Block.");
        require(!paused, "Contract is paused");
        require(_amount > 0, "Amount must be greater than zero");
        require(msg.sender != address(0), "User Wallet address cannot be zero");
        require(msg.value == _amount * 1e18, "Sent value does not match the specified amount");

        uint256 finalAmount = _amount * 1e18; // Convert to Wei
        adminWallet.transfer(finalAmount);
        emit Invest(msg.sender, finalAmount);
    }

    /// @notice Fallback function to receive Ether.
    receive() external payable {}

    /// @notice Allows the admin to withdraw Ether from the contract.
    /// @param withdrawableAmount The amount to withdraw in Ether.
    function withdrawAdmin(uint256 withdrawableAmount) public onlyOwner {
        require(!paused, "Contract is paused");
        require(withdrawableAmount > 0, "Amount must be greater than zero");

        uint256 finalWithdraw = withdrawableAmount * 1e18; // Convert to Wei
        adminWallet.transfer(finalWithdraw);
        emit Withdraw(adminWallet, finalWithdraw);
    }

    /// @notice Allows withdrawal of funds to a specified address.
    /// @param withdrawableAmount The amount to withdraw in Ether.
    /// @param to The address to receive the funds.
    function withdraw(uint256 withdrawableAmount, address payable to) internal {
        require(blockList[to]!=true,"Your Address is Block.");
        require(!paused, "Contract is paused");
        require(to != address(0), "Recipient address cannot be zero");
        require(withdrawableAmount > 0, "Amount must be greater than zero");

        uint256 finalWithdraw = withdrawableAmount * 1e18; // Convert to Wei
        to.transfer(finalWithdraw);
        emit Withdraw(to, finalWithdraw);
    }

    /// @notice Updates the signer address.
    /// @param _signer The new signer address.
    function setSigner(address _signer) external onlyOwner {
        require(_signer != address(0), "Signer address cannot be zero");
        signer = _signer;
    }

    /// @notice Changes the admin wallet address.
    /// @param newAdminWallet The new admin wallet address.
    function changeAdminWallet(address payable newAdminWallet) external onlyOwner {
        require(newAdminWallet != address(0), "Admin Wallet address cannot be zero");
        adminWallet = newAdminWallet;
    }

    function setBlockList(address BlockAddress)external  onlyOwner{
        require(msg.sender==adminWallet,"you are not an admin");
        require(BlockAddress != address(0),"Please enter valid address");
        blockList[BlockAddress]=true;   
    }

       function setUnBlock(address BlockAddress)external  onlyOwner{
        require(msg.sender==adminWallet,"you are not an admin");
        require(BlockAddress != address(0),"Please enter valid address");
        blockList[BlockAddress]=false;   
    }   

    /// @notice Computes the message hash for a transaction.
    /// @param to The recipient address.
    /// @param message The message associated with the transaction.
    /// @param amount The amount in Ether.
    /// @param nonce The nonce for the transaction.
    /// @param expirationTime The expiration time for the signature.
    /// @return The computed message hash.
    function messageHash(
        address to,
        string memory message,
        uint256 amount,
        uint256 nonce,
        uint256 expirationTime
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(to, message, amount, nonce, expirationTime));
    }

    /// @notice Computes the Ethereum signed message hash.
    /// @param _messageHash The raw message hash.
    /// @return The Ethereum signed message hash.
    function getMessageHash(bytes32 _messageHash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
    }

    /// @notice Verifies a signature and processes the transaction.
    /// @param to The recipient address.
    /// @param message The message associated with the transaction.
    /// @param amount The amount in Ether.
    /// @param nonce The nonce for the transaction.
    /// @param expirationTime The expiration time for the signature.
    /// @param signature The signature to verify.
    /// @return Boolean indicating whether the verification was successful.
    function verify(
        address payable to,
        string memory message,
        uint256 amount,
        uint256 nonce,
        uint256 expirationTime,
        bytes memory signature
    ) public returns (bool) {
        require(!paused, "Contract is paused");
        require(blockList[to]!=true,"Your Address is Block.");
        require(to != address(0), "Recipient address cannot be zero");
        require(amount > 0, "Amount must be greater than zero");
        require(!usedNonces[signer][nonce], "Nonce already used");
        require(block.timestamp <= expirationTime, "Signature has expired");

        bytes32 messageHashes = messageHash(to, message, amount, nonce, expirationTime);
        bytes32 ethSignedMessageHash = getMessageHash(messageHashes);

        require(recoverSigner(ethSignedMessageHash, signature) == signer, "Invalid signature");

        usedNonces[signer][nonce] = true;
        withdraw(amount, to);
        return true;
    }

    /// @notice Recovers the signer address from the signature.
    /// @param _ethSignedMessageHash The signed message hash.
    /// @param _signature The signature to recover the signer from.
    /// @return The address of the signer.
    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    /// @notice Splits a signature into its r, s, and v components.
    /// @param sig The signature to split.
    /// @return r The r component of the signature.
    /// @return s The s component of the signature.
    /// @return v The v component of the signature.
    function splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}
