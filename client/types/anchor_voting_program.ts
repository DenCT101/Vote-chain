/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/anchor_voting_program.json`.
 */
export type AnchorVotingProgram = {
  "address": "7QFYjVpv8vsSyxuiuLcTPpErcNkVZ1Liag8F9K5tqhVD",
  "metadata": {
    "name": "anchorVotingProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addCandidate",
      "discriminator": [
        172,
        34,
        30,
        247,
        165,
        210,
        224,
        164
      ],
      "accounts": [
        {
          "name": "candidate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  110,
                  100,
                  105,
                  100,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "candidateKey"
              },
              {
                "kind": "arg",
                "path": "electionId"
              }
            ]
          }
        },
        {
          "name": "election",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "electionId"
              },
              {
                "kind": "account",
                "path": "electionGenerator"
              }
            ]
          }
        },
        {
          "name": "electionGenerator",
          "writable": true,
          "signer": true,
          "relations": [
            "election"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "candidateKey",
          "type": "string"
        },
        {
          "name": "electionId",
          "type": "string"
        },
        {
          "name": "candidateName",
          "type": "string"
        },
        {
          "name": "candidateSlogan",
          "type": "string"
        }
      ]
    },
    {
      "name": "addVote",
      "discriminator": [
        81,
        36,
        221,
        115,
        72,
        168,
        222,
        43
      ],
      "accounts": [
        {
          "name": "candidate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  110,
                  100,
                  105,
                  100,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "candidateKey"
              },
              {
                "kind": "arg",
                "path": "electionId"
              }
            ]
          }
        },
        {
          "name": "voter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  111,
                  116,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "electionId"
              },
              {
                "kind": "account",
                "path": "voterSigner"
              }
            ]
          }
        },
        {
          "name": "voterSigner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "electionId",
          "type": "string"
        },
        {
          "name": "candidateKey",
          "type": "string"
        }
      ]
    },
    {
      "name": "closeElection",
      "discriminator": [
        62,
        216,
        57,
        149,
        90,
        21,
        40,
        127
      ],
      "accounts": [
        {
          "name": "election",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "electionId"
              },
              {
                "kind": "account",
                "path": "electionGenerator"
              }
            ]
          }
        },
        {
          "name": "electionGenerator",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "electionId",
          "type": "string"
        }
      ]
    },
    {
      "name": "createElection",
      "discriminator": [
        190,
        206,
        84,
        42,
        83,
        221,
        248,
        249
      ],
      "accounts": [
        {
          "name": "election",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  108,
                  101,
                  99,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "electionId"
              },
              {
                "kind": "account",
                "path": "electionGenerator"
              }
            ]
          }
        },
        {
          "name": "electionGenerator",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "electionId",
          "type": "string"
        },
        {
          "name": "electionTitle",
          "type": "string"
        },
        {
          "name": "electionDescription",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "candidateAccountState",
      "discriminator": [
        252,
        251,
        4,
        191,
        191,
        210,
        187,
        154
      ]
    },
    {
      "name": "electionAccountState",
      "discriminator": [
        175,
        152,
        224,
        124,
        196,
        98,
        235,
        201
      ]
    },
    {
      "name": "voteAccount",
      "discriminator": [
        203,
        238,
        154,
        106,
        200,
        131,
        0,
        41
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "electionIdTooLong",
      "msg": "Election ID too long!"
    },
    {
      "code": 6001,
      "name": "candidatekeytoolong",
      "msg": "Candidate key too long!"
    },
    {
      "code": 6002,
      "name": "candidateNameTooLong",
      "msg": "Election Name too long!"
    },
    {
      "code": 6003,
      "name": "candidateSloganTooLong",
      "msg": "Election Slogan too long!"
    },
    {
      "code": 6004,
      "name": "electionDoesNotExist",
      "msg": "Election is not created yet!"
    }
  ],
  "types": [
    {
      "name": "candidateAccountState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "electionId",
            "type": "string"
          },
          {
            "name": "candidateKey",
            "type": "string"
          },
          {
            "name": "candidateName",
            "type": "string"
          },
          {
            "name": "candidateSlogan",
            "type": "string"
          },
          {
            "name": "voteCounts",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "electionAccountState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "electionGenerator",
            "type": "pubkey"
          },
          {
            "name": "electionId",
            "type": "string"
          },
          {
            "name": "electionTitle",
            "type": "string"
          },
          {
            "name": "electionDescription",
            "type": "string"
          },
          {
            "name": "isActive",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "voteAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "voter",
            "type": "pubkey"
          },
          {
            "name": "electionId",
            "type": "string"
          },
          {
            "name": "candidateKey",
            "type": "string"
          }
        ]
      }
    }
  ]
};
