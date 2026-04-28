"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseNaturalLanguageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ParseNaturalLanguageDto {
    text;
}
exports.ParseNaturalLanguageDto = ParseNaturalLanguageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Call John tomorrow at 3pm about the project proposal' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ParseNaturalLanguageDto.prototype, "text", void 0);
//# sourceMappingURL=parse-natural-language.dto.js.map