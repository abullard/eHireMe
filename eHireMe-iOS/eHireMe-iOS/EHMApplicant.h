//
//  EHMApplicant.h
//  eHireMe-iOS
//
//  Created by Mac Liu on 2/19/16.
//  Copyright © 2016 eHireMe. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface EHMApplicant : NSObject

@property(strong, nonatomic) NSString *name;
@property(strong, nonatomic) NSString *bio;
@property(strong, nonatomic) NSString *email;
@property(strong, nonatomic) NSString *city;
@property(strong, nonatomic) NSString *state;
@property(nonatomic) NSInteger *age;
@property(strong, nonatomic) NSString *dob;

- (id)initWithDictionary:(NSDictionary *)dictionary;

@end
