"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var faker_1 = require("@faker-js/faker");
var extension_1 = require("@prisma/client/extension");
var prisma = new extension_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var i, user, j;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 60)) return [3 /*break*/, 7];
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: faker_1.faker.internet.email(),
                                first_name: faker_1.faker.name.firstName(),
                                role: client_1.Role.user,
                                password: 'password',
                                profile: {
                                    create: {
                                        bio: faker_1.faker.lorem.sentences(),
                                        profile_picture: faker_1.faker.image.avatar(),
                                        cover_picture: faker_1.faker.image.imageUrl(),
                                        location: faker_1.faker.address.city(),
                                        website: faker_1.faker.internet.url(),
                                        birthdate: faker_1.faker.date.past(),
                                        gender: client_1.Gender.MALE,
                                    },
                                },
                            },
                        })];
                case 2:
                    user = _a.sent();
                    j = 0;
                    _a.label = 3;
                case 3:
                    if (!(j < 10)) return [3 /*break*/, 6];
                    return [4 /*yield*/, prisma.post.create({
                            data: {
                                author_id: user.id,
                                title: faker_1.faker.lorem.sentence(),
                                published: faker_1.faker.datatype.boolean(),
                                post_image: {
                                    create: [
                                        {
                                            img_path: faker_1.faker.image.imageUrl(),
                                        },
                                    ],
                                },
                                categories: {
                                    create: [
                                        {
                                            category: {
                                                create: {
                                                    name: faker_1.faker.lorem.word(),
                                                },
                                            },
                                        },
                                    ],
                                },
                                Comment: {
                                    create: [
                                        {
                                            content: faker_1.faker.lorem.sentences(),
                                            author_id: user.id,
                                            replay: {
                                                create: [
                                                    {
                                                        content: faker_1.faker.lorem.sentences(),
                                                        author_id: user.id,
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                                reaction: {
                                    create: [
                                        {
                                            type: client_1.ReactionType.like,
                                            count: faker_1.faker.datatype.number({ min: 1, max: 100 }),
                                        },
                                        {
                                            type: client_1.ReactionType.angry,
                                            count: faker_1.faker.datatype.number({ min: 1, max: 100 }),
                                        },
                                    ],
                                },
                            },
                        })];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    j++;
                    return [3 /*break*/, 3];
                case 6:
                    i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })
    .catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.error(e);
                return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(1);
                return [2 /*return*/];
        }
    });
}); });
