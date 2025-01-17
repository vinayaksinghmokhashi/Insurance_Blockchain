/*
 * SPDX-License-Identifier: Apache-2.0
 */

// 'use strict';



/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ClaimContract extends Contract {

    async claimExists(ctx, claimId) {
        const buffer = await ctx.stub.getState(claimId);
        return (!!buffer && buffer.length > 0);
    }

    async checkClaimExistence(ctx, claimId) {
        const exists = await this.claimExists(ctx, claimId);
        if (exists) {
            throw new Error(`The claim ${claimId} already exists`);
        }
    }

    async createClaim(ctx, claimId, value) {
        await this.checkClaimExistence(ctx, claimId);
        const asset = { value, status: 'Pending' }; // Assuming 'Pending' status initially
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(claimId, buffer);
    }

    async approveClaim(ctx, claimId, value, status) {
        const exists = await this.claimExists(ctx, claimId);
        if (!exists) {
            throw new Error(`The claim ${claimId} does not exist`);
        }
        const asset = { value, status };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(claimId, buffer);
    }

    async requestVerification(ctx, claimId) {
        const exists = await this.claimExists(ctx, claimId);
        if (!exists) {
            throw new Error(`The claim ${claimId} does not exist`);
        }
        const asset = await this.readClaim(ctx, claimId);
        // if (asset.status !== 'Pending') {
        //     throw new Error(`Claim ${claimId} is not in pending status`);
        // }
        asset.status = 'VerificationRequested';
        await this.updateClaimStatus(ctx, claimId, asset.status);
    }

    async verifyClaim(ctx, claimId) {
        const exists = await this.claimExists(ctx, claimId);
        if (!exists) {
            throw new Error(`The claim ${claimId} does not exist`);
        }
        const asset = await this.readClaim(ctx, claimId);
        if (asset.status !== 'VerificationRequested') {
            throw new Error(`Claim ${claimId} is not in verification requested status`);
        }
        // Perform verification logic, e.g., contacting the Enterprise for verification
        // Assuming verification is successful for simplicity
        asset.status = 'Approved';
        await this.updateClaimStatus(ctx, claimId, asset.status);
    }

    async readClaim(ctx, claimId) {
        const exists = await this.claimExists(ctx, claimId);
        if (!exists) {
            throw new Error(`The claim ${claimId} does not exist`);
        }
        const buffer = await ctx.stub.getState(claimId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateClaimStatus(ctx, claimId, newStatus) {
        const asset = await this.readClaim(ctx, claimId);
        asset.status = newStatus;
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(claimId, buffer);
    }

    async updateClaim(ctx, claimId, newValue) {
        const exists = await this.claimExists(ctx, claimId);
        if (!exists) {
            throw new Error(`The claim ${claimId} does not exist`);
        }
        const asset = { value: newValue, status: 'Pending' }; // Assuming 'Pending' status initially
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(claimId, buffer);
    }

    async deleteClaim(ctx, claimId) {
        const exists = await this.claimExists(ctx, claimId);
        if (!exists) {
            throw new Error(`The claim ${claimId} does not exist`);
        }
        await ctx.stub.deleteState(claimId);
    }
}

module.exports = ClaimContract;


// const { Contract } = require('fabric-contract-api');

// class ClaimContract extends Contract {

//     async claimExists(ctx, claimId) {
//         const buffer = await ctx.stub.getState(claimId);
//         return (!!buffer && buffer.length > 0);
//     }

//     // async createClaim(ctx, claimId, value) {
//     //     const exists = await this.claimExists(ctx, claimId);
//     //     if (exists) {
//     //         throw new Error(`The claim ${claimId} already exists`);
//     //     }
//     //     const asset = { value };
//     //     const buffer = Buffer.from(JSON.stringify(asset));
//     //     await ctx.stub.putState(claimId, buffer);
//     // }

//     async createClaim(ctx, claimId, value) {
//         await this.checkClaimExistence(ctx, claimId);
//         const asset = { value };
//         const buffer = Buffer.from(JSON.stringify(asset));
//         await ctx.stub.putState(claimId, buffer);
//     }

//     async approveClaim(ctx, claimId, value, status) {
//         const exists = await this.claimExists(ctx, claimId);
//         if (!exists) {
//             throw new Error(`The claim ${claimId} does not exist`);
//         }
//         const asset = { value, status };
//         const buffer = Buffer.from(JSON.stringify(asset));
//         await ctx.stub.putState(claimId, buffer);
//     }

//     async checkClaimExistence(ctx, claimId) {
//         const exists = await this.claimExists(ctx, claimId);
//         if (exists) {
//             throw new Error(`The claim ${claimId} already exists`);
//         }
//     }

//     async readClaim(ctx, claimId) {
//         // await this.checkClaimExistence(ctx, claimId);
//         const buffer = await ctx.stub.getState(claimId);
//         const asset = JSON.parse(buffer.toString());
//         return asset; // Return both value and status
//     }

//     // async readClaim(ctx, claimId) {
//     //     const exists = await this.claimExists(ctx, claimId);
//     //     if (!exists) {
//     //         throw new Error(`The claim ${claimId} does not exist`);
//     //     }
//     //     const buffer = await ctx.stub.getState(claimId);
//     //     const asset = JSON.parse(buffer.toString());
//     //     console.log(asset.status);
//     //     return asset;
        
//     // }

//     async updateClaim(ctx, claimId, newValue) {
//         const exists = await this.claimExists(ctx, claimId);
//         if (!exists) {
//             throw new Error(`The claim ${claimId} does not exist`);
//         }
//         const asset = { value: newValue };
//         const buffer = Buffer.from(JSON.stringify(asset));
//         await ctx.stub.putState(claimId, buffer);
//     }

//     async deleteClaim(ctx, claimId) {
//         const exists = await this.claimExists(ctx, claimId);
//         if (!exists) {
//             throw new Error(`The claim ${claimId} does not exist`);
//         }
//         await ctx.stub.deleteState(claimId);
//     }

// }

// module.exports = ClaimContract;






// /*
//  * SPDX-License-Identifier: Apache-2.0
//  */

// 'use strict';

// const { Contract } = require('fabric-contract-api');

// class ClaimContract extends Contract {

//     async claimExists(ctx, claimId) {
//         const buffer = await ctx.stub.getState(claimId);
//         return (!!buffer && buffer.length > 0);
//     }

//     async createClaim(ctx, claimId, value) {
//         const exists = await this.claimExists(ctx, claimId);
//         if (exists) {
//             throw new Error(`The claim ${claimId} already exists`);
//         }
//         const asset = { value };
//         const buffer = Buffer.from(JSON.stringify(asset));
//         await ctx.stub.putState(claimId, buffer);
//     }

//     async readClaim(ctx, claimId) {
//         const exists = await this.claimExists(ctx, claimId);
//         if (!exists) {
//             throw new Error(`The claim ${claimId} does not exist`);
//         }
//         const buffer = await ctx.stub.getState(claimId);
//         const asset = JSON.parse(buffer.toString());
//         return asset;
//     }

//     async updateClaim(ctx, claimId, newValue) {
//         const exists = await this.claimExists(ctx, claimId);
//         if (!exists) {
//             throw new Error(`The claim ${claimId} does not exist`);
//         }
//         const asset = { value: newValue };
//         const buffer = Buffer.from(JSON.stringify(asset));
//         await ctx.stub.putState(claimId, buffer);
//     }

//     async deleteClaim(ctx, claimId) {
//         const exists = await this.claimExists(ctx, claimId);
//         if (!exists) {
//             throw new Error(`The claim ${claimId} does not exist`);
//         }
//         await ctx.stub.deleteState(claimId);
//     }

// }

// module.exports = ClaimContract;
